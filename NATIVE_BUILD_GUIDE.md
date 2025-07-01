# Native Build Guide for Firebase Push Notifications

This guide will help you create a native build of your app to use Firebase push notifications.

## Prerequisites

1. Expo account (free)
2. Firebase project
3. Android device or emulator for testing

## Step 1: Set Up Firebase Project

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select existing project
3. Enter project name: `deremate-front-reactnative-app`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 1.2 Add Android App
1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Add app" and select Android
4. Enter package name: `com.anonymous.deremate_front_reactnative_app`
5. Enter app nickname: `Deremate App`
6. Click "Register app"
7. Download `google-services.json`
8. Place the file in your project root (replace the placeholder)

### 1.3 Enable Cloud Messaging
1. In Firebase Console, go to "Cloud Messaging"
2. Click "Get started"
3. Note your Server key (you'll need this for testing)

## Step 2: Login to Expo

```bash
npx eas-cli login
```

Follow the prompts to log in to your Expo account.

## Step 3: Create Development Build

### 3.1 Build for Development
```bash
npx eas-cli build --platform android --profile development
```

This will:
- Create a development build with Firebase support
- Generate an APK file
- Take about 10-15 minutes to complete

### 3.2 Install Development Client
```bash
npx eas-cli build:run --platform android
```

This will install the development build on your connected device.

## Step 4: Test Firebase Notifications

### 4.1 Get FCM Token
1. Run your app on the development build
2. Check the console for: `[Firebase] FCM Token: YOUR_TOKEN`
3. Copy this token

### 4.2 Test with Firebase Console
1. Go to Firebase Console > Cloud Messaging
2. Click "Send your first message"
3. Enter:
   - Title: "Nuevo Paquete Disponible"
   - Body: "Hay un nuevo paquete en el depósito"
4. Select "Single device" and paste your FCM token
5. Click "Send"

### 4.3 Test with Script
1. Update `test-notifications.js` with your FCM token and Server key
2. Run: `node test-notifications.js`

## Step 5: Development Workflow

### 5.1 Start Development Server
```bash
npx expo start --dev-client
```

### 5.2 Update App
- Make changes to your code
- Save files
- The app will automatically reload with changes

### 5.3 Test Notifications
- Use the test script or Firebase Console
- Check that notifications appear correctly
- Verify new package detection works

## Troubleshooting

### Common Issues

1. **"No Firebase App '[DEFAULT]' has been created"**
   - Ensure `google-services.json` is in the project root
   - Rebuild the app after adding the file

2. **Build fails**
   - Check that all Firebase dependencies are installed
   - Verify `app.json` configuration is correct
   - Check EAS build logs for specific errors

3. **Notifications not working**
   - Verify FCM token is generated
   - Check device notification permissions
   - Ensure Firebase project is properly configured

### Debug Steps

1. Check console logs for FCM token
2. Verify Firebase configuration
3. Test with Firebase Console first
4. Check device notification settings

## Next Steps

1. **Production Build**: When ready, create a production build
2. **App Store**: Submit to Google Play Store
3. **Backend Integration**: Connect your backend to send notifications
4. **Analytics**: Add Firebase Analytics for better insights

## Commands Reference

```bash
# Login to Expo
npx eas-cli login

# Create development build
npx eas-cli build --platform android --profile development

# Install on device
npx eas-cli build:run --platform android

# Start development server
npx expo start --dev-client

# Create production build
npx eas-cli build --platform android --profile production

# Submit to store
npx eas-cli submit --platform android
```

## Firebase Configuration Files

Make sure you have these files in place:

- `google-services.json` (Android Firebase config)
- `app.json` (Expo configuration with Firebase plugins)
- `eas.json` (EAS build configuration)

The Firebase setup is now complete and you can test push notifications with your native build!