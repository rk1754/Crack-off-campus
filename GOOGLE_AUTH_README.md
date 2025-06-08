# Google Sign-In Implementation

This document outlines how to set up and configure Google Sign-In for your Crack-off-campus application.

## Setup Instructions

### 1. Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Navigate to "Authentication" > "Sign-in method"
4. Enable the "Google" provider
5. Add your authorized domains

### 2. Frontend Configuration

1. Update the Firebase configuration in `frontend/src/config/firebase.ts` with your actual Firebase project credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};
```

### 3. Backend Configuration

1. Generate a Firebase Admin SDK service account key:

   - In Firebase Console, go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file securely

2. Update the Firebase Admin credentials in `backend/src/config/firebase.ts`:

```typescript
const serviceAccount = {
  type: "service_account",
  project_id: "YOUR_PROJECT_ID",
  private_key_id: "YOUR_PRIVATE_KEY_ID",
  private_key: "YOUR_PRIVATE_KEY",
  client_email: "YOUR_CLIENT_EMAIL",
  client_id: "YOUR_CLIENT_ID",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "YOUR_CLIENT_CERT_URL",
  universe_domain: "googleapis.com",
};
```

## Features Implemented

1. **Google Sign-In Button**: Added to login and registration pages
2. **Backend Authentication**: API endpoint to verify Google ID tokens
3. **User Account Creation**: Auto-creates user accounts for new Google users
4. **Account Linking**: Updates existing accounts with Google credentials when appropriate
5. **JWT Authentication**: After successful Google authentication, creates JWT token for future authenticated requests

## Testing

1. Make sure both frontend and backend servers are running
2. Go to the login page and click "Continue with Google"
3. Authorize with your Google account
4. You should be redirected to the app homepage after successful authentication

## Troubleshooting

- Check browser console for JavaScript errors
- Check server logs for backend authentication errors
- Ensure Firebase configuration values are correct
- Verify that the Google Sign-In method is enabled in Firebase Console
