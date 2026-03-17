# Convo Sharing 🚀

A private, secure, and instant messaging web application with ShareX-inspired aesthetics. Built with React, Tailwind CSS v4, and Firebase.

## Features
- **Instant Rooms**: No accounts required. Join or create rooms via unique codes.
- **Real-time Chat**: Powered by Firestore for instantaneous messaging.
- **Media Sharing**: Easily share images and files (Firebase Storage support).
- **ShareX Theme**: Clean, sleek, and high-performance UI.
- **Micro-interactions**: Framer Motion powered animations for a premium feel.
- **Dark Mode**: Fully responsive dark and light theme support.

## 🚀 Setup Instructions

### 1. Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Add a **Web App** to your project.
4. Copy the Firebase configuration object.
5. In the **Build** menu:
   - Enable **Firestore Database** (test mode or specific rules).
   - Enable **Storage** (test mode).

### 2. Environment Variables
1. Create a `.env` file in the root directory.
2. Fill it with your Firebase credentials as shown in `.env.example`.

### 3. Local Development
```bash
npm install
npm run dev
```

### 4. Deployment
```bash
npm run build
# Deploy using your preferred hosting service or Firebase Hosting
```

## 🔐 Privacy
This app uses unique room IDs for private routing. Ensure your Firebase Security Rules are configured to protect data based on your specific privacy requirements.
