# Document Management Platform

## Firebase configuration

Create a `.env` file in the project root and supply your Firebase client credentials:

```
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

Restart Vite after updating the file so the new values are picked up. If the variables are not provided the app will fall back to the sample credentials baked into `src/config/firebase.js`.

## Cloudinary configuration

Document uploads are stored in Cloudinary. Add these keys to `.env` as well:

```
VITE_CLOUDINARY_CLOUD_NAME=xxx
VITE_CLOUDINARY_UPLOAD_PRESET=unsigned_preset_name
VITE_CLOUDINARY_BASE_FOLDER=secure-documents
VITE_CLOUDINARY_FOLDER_MODE=dynamic
```

`VITE_CLOUDINARY_UPLOAD_PRESET` must be an unsigned preset created in the Cloudinary console and configured to allow the file types you intend to upload.
