import admin from 'firebase-admin';
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccount)),
    });
  } else {
    console.warn(
      'Firebase Admin SDK not initialized. FIREBASE_SERVICE_ACCOUNT_KEY is missing.'
    );
  }
}

const adminAuth = serviceAccount ? getAuth() : null;

export { adminAuth };

export async function getServerSideUser() {
  if (!adminAuth) return null;

  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
}
