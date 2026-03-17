=======
# Quiet Place 🌿

A private, invite-only messaging web application built with React, Tailwind CSS v4, and Firebase.

## Features
- **Secret Codes**: No accounts. Join or create rooms via unique codes.
- **Real-time Chat**: Powered by Firestore.
- **Media Sharing**: Drag and drop or select images/files to share (Firebase Storage).
- **Premium UI**: Glassmorphism, smooth animations, and warm aesthetics.
- **Customizable**: Dark/Light mode toggle and sound notifications.

## 🚀 Setup Instructions

### 1. Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Add a **Web App** to your project.
4. Copy the Firebase configuration object.
5. In the **Build** menu:
   - Enable **Firestore Database** in test mode or with rules restricting access by `roomId`.
   - Enable **Storage** in test mode.

### 2. Environment Variables
1. Create a `.env` file in the root directory.
2. Fill it with your Firebase credentials as shown in `.env.example`.

### 3. Local Development
```bash
npm install
npm run dev
```

### 4. Deployment
The app is ready for Firebase Hosting.
```bash
npm run build
# Then deploy using firebase-tools
```

## 🔐 Security Note
Ensure your Firestore rules check for the existence of the `roomId` in the message path to maintain privacy.
=======
# quietplace

