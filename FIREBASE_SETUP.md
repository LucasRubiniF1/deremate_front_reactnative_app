# Firebase Push Notifications Setup

This guide will help you set up Firebase Cloud Messaging (FCM) for push notifications in your React Native app.

## Prerequisites

1. A Firebase project
2. Google Services configuration files

## Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Cloud Messaging in the project settings

### 2. Add Android App

1. In Firebase Console, go to Project Settings > General
2. Scroll down to "Your apps" section
3. Click "Add app" and select Android
4. Enter your package name: `com.anonymous.deremate_front_reactnative_app`
5. Download the `google-services.json` file
6. Place the file in the root directory of your project

### 3. Add iOS App (if needed)

1. In Firebase Console, go to Project Settings > General
2. Click "Add app" and select iOS
3. Enter your bundle ID: `com.anonymous.deremate_front_reactnative_app`
4. Download the `GoogleService-Info.plist` file
5. Place the file in the `ios/` directory of your project

### 4. Configure iOS (if needed)

For iOS, you'll need to:
1. Add the `GoogleService-Info.plist` to your Xcode project
2. Configure push notification capabilities in Xcode
3. Generate and upload APNs certificates to Firebase

### 5. Test Push Notifications

You can test push notifications using:

#### Firebase Console
1. Go to Cloud Messaging in Firebase Console
2. Click "Send your first message"
3. Enter notification title and body
4. Select your app as the target
5. Send the message

#### Using FCM Token
1. Run your app and check the console for the FCM token
2. Use the token to send a test message via Firebase Console or FCM API

## API Integration

To send notifications from your backend, you can:

1. Store FCM tokens in your database
2. Use Firebase Admin SDK or FCM HTTP API
3. Send notifications when new packages are added

### Example FCM API Call

```bash
curl -X POST -H "Authorization: key=YOUR_SERVER_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "to": "FCM_TOKEN_HERE",
       "notification": {
         "title": "Nuevo Paquete Disponible",
         "body": "Hay un nuevo paquete en el depósito"
       },
       "data": {
         "packageId": "123",
         "packageLocation": "Sector A, Estante 1"
       }
     }' \
     https://fcm.googleapis.com/fcm/send
```

## Troubleshooting

### Common Issues

1. **"No Firebase App '[DEFAULT]' has been created"**
   - Make sure `google-services.json` is in the correct location
   - Rebuild the app after adding the file

2. **Notifications not showing**
   - Check if permissions are granted
   - Verify FCM token is generated
   - Check Firebase Console for delivery status

3. **Background notifications not working**
   - Ensure background message handler is properly configured
   - Check app permissions in device settings

### Debug Steps

1. Check console logs for FCM token generation
2. Verify Firebase configuration files are correct
3. Test with Firebase Console first
4. Check device notification settings

## Security Notes

- Keep your Firebase Server Key secure
- Use Firebase Admin SDK on your backend
- Implement proper token management
- Consider implementing topic-based notifications for better scalability 