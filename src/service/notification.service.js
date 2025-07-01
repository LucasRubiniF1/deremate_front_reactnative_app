import { initializeFirebaseMessaging } from './firebase.service';
import { saveToken, getToken } from '../utils/secureStore';

class NotificationService {
  constructor() {
    this.isInitialized = false;
    this.unsubscribe = null;
    this.previousPackages = new Set();
    this.onNewPackageCallback = null;
  }

  // Initialize the notification service
  async initialize(onNewPackage) {
    if (this.isInitialized) {
      console.log('[NotificationService] Already initialized');
      return;
    }

    try {
      console.log('[NotificationService] Initializing...');
      
      const result = await initializeFirebaseMessaging((message) => {
        console.log('[NotificationService] Firebase message received:', message);
        if (this.onNewPackageCallback) {
          this.onNewPackageCallback(message);
        }
      });

      if (result && result.token) {
        // Save the FCM token for later use
        await saveToken('fcmToken', result.token);
        this.unsubscribe = result.unsubscribe;
        this.isInitialized = true;
        this.onNewPackageCallback = onNewPackage;
        
        console.log('[NotificationService] Initialized successfully');
        return true;
      } else {
        console.log('[NotificationService] Failed to initialize Firebase messaging');
        return false;
      }
    } catch (error) {
      console.error('[NotificationService] Error initializing:', error);
      return false;
    }
  }

  // Check for new packages and send notifications
  checkForNewPackages(currentPackages) {
    if (!this.isInitialized || !currentPackages || currentPackages.length === 0) {
      return;
    }

    const currentPackageIds = new Set(currentPackages.map(pkg => pkg.id));
    const newPackages = [];

    // Find new packages
    currentPackages.forEach(pkg => {
      if (!this.previousPackages.has(pkg.id)) {
        newPackages.push(pkg);
      }
    });

    // Update previous packages set
    this.previousPackages = currentPackageIds;

    // Send notifications for new packages
    if (newPackages.length > 0) {
      console.log('[NotificationService] Found new packages:', newPackages.length);
      this.sendNewPackageNotification(newPackages);
    }
  }

  // Send notification for new packages
  sendNewPackageNotification(newPackages) {
    if (newPackages.length === 0) return;

    const packageCount = newPackages.length;
    const title = packageCount === 1 
      ? 'Nuevo Paquete Disponible' 
      : `${packageCount} Nuevos Paquetes Disponibles`;
    
    const body = packageCount === 1
      ? `Paquete #${newPackages[0].id} disponible en ${newPackages[0].packageLocation || 'el depósito'}`
      : `${packageCount} nuevos paquetes han llegado al depósito`;

    // Trigger the callback to handle the notification
    if (this.onNewPackageCallback) {
      this.onNewPackageCallback({
        notification: {
          title,
          body
        },
        data: {
          packageIds: newPackages.map(pkg => pkg.id.toString()).join(','),
          packageCount: packageCount.toString()
        }
      });
    }
  }

  // Get the FCM token
  async getFCMToken() {
    try {
      return await getToken('fcmToken');
    } catch (error) {
      console.error('[NotificationService] Error getting FCM token:', error);
      return null;
    }
  }

  // Cleanup
  cleanup() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.isInitialized = false;
    this.previousPackages.clear();
    this.onNewPackageCallback = null;
    console.log('[NotificationService] Cleaned up');
  }
}

// Export singleton instance
export const notificationService = new NotificationService(); 