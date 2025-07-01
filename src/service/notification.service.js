import { initializeFirebaseMessaging } from './firebase.service';
import { saveToken, getToken } from '../utils/secureStore';

class NotificationService {
  constructor() {
    this.isInitialized = false;
    this.unsubscribe = null;
    this.onNewPackageCallback = null;
  }

  // Initialize the notification service (only for receiving push notifications)
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
    this.onNewPackageCallback = null;
    console.log('[NotificationService] Cleaned up');
  }
}

// Export singleton instance
export const notificationService = new NotificationService(); 