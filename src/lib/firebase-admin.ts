import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    console.warn(
      'Firebase Admin SDK service account not found in environment variables. Some server-side Firebase features may not work.'
    );
    // Initialize without credentials if you want some features to work in dev
    // without a service account, but some will fail.
    admin.initializeApp();
  }
}

export { admin };
