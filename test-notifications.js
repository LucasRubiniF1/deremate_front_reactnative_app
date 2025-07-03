// Test script for Firebase Cloud Messaging
// Replace YOUR_SERVER_KEY with your Firebase Server Key
// Replace FCM_TOKEN with the token from your app console

const FCM_SERVER_KEY = 'YOUR_SERVER_KEY'; // Get this from Firebase Console > Project Settings > Cloud Messaging
const FCM_TOKEN = 'FCM_TOKEN_HERE'; // Get this from your app console

const testNotification = async () => {
  try {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        Authorization: `key=${FCM_SERVER_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: FCM_TOKEN,
        notification: {
          title: 'Nuevo Paquete Disponible',
          body: 'Hay un nuevo paquete en el depósito - Sector A, Estante 1',
          icon: 'notification-icon',
          color: '#3a86ff',
        },
        data: {
          packageId: '123',
          packageLocation: 'Sector A, Estante 1',
          timestamp: new Date().toISOString(),
        },
        priority: 'high',
      }),
    });

    const result = await response.json();
    console.log('Notification sent:', result);

    if (result.success === 1) {
      console.log('✅ Notification sent successfully!');
    } else {
      console.log('❌ Failed to send notification:', result);
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Test multiple notifications
const testMultipleNotifications = async () => {
  const notifications = [
    {
      title: 'Nuevo Paquete #123',
      body: 'Paquete disponible en Sector A, Estante 1',
      packageId: '123',
      location: 'Sector A, Estante 1',
    },
    {
      title: 'Nuevo Paquete #456',
      body: 'Paquete disponible en Sector B, Estante 2',
      packageId: '456',
      location: 'Sector B, Estante 2',
    },
    {
      title: '2 Nuevos Paquetes',
      body: 'Múltiples paquetes han llegado al depósito',
      packageId: '789,790',
      location: 'Varios sectores',
    },
  ];

  for (let i = 0; i < notifications.length; i++) {
    const notification = notifications[i];
    console.log(`\nSending notification ${i + 1}/${notifications.length}: ${notification.title}`);

    try {
      const response = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          Authorization: `key=${FCM_SERVER_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: FCM_TOKEN,
          notification: {
            title: notification.title,
            body: notification.body,
            icon: 'notification-icon',
            color: '#3a86ff',
          },
          data: {
            packageId: notification.packageId,
            packageLocation: notification.location,
            timestamp: new Date().toISOString(),
          },
          priority: 'high',
        }),
      });

      const result = await response.json();
      if (result.success === 1) {
        console.log(`✅ Notification ${i + 1} sent successfully!`);
      } else {
        console.log(`❌ Failed to send notification ${i + 1}:`, result);
      }
    } catch (error) {
      console.error(`Error sending notification ${i + 1}:`, error);
    }

    // Wait 2 seconds between notifications
    if (i < notifications.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};

// Usage instructions
console.log(`
🚀 Firebase Push Notification Test Script

To use this script:

1. Get your Firebase Server Key:
   - Go to Firebase Console > Project Settings > Cloud Messaging
   - Copy the "Server key"

2. Get your FCM Token:
   - Run your app and check the console
   - Look for: "[Firebase] FCM Token: YOUR_TOKEN_HERE"

3. Update the constants at the top of this file:
   - Replace YOUR_SERVER_KEY with your actual server key
   - Replace FCM_TOKEN_HERE with your actual FCM token

4. Run the script:
   - node test-notifications.js

Available functions:
- testNotification(): Send a single test notification
- testMultipleNotifications(): Send multiple test notifications

Example usage:
`);

// Uncomment the line below to test a single notification
// testNotification();

// Uncomment the line below to test multiple notifications
// testMultipleNotifications();

module.exports = {
  testNotification,
  testMultipleNotifications,
};
