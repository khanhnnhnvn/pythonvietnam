import admin from 'firebase-admin';
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!admin.apps.length) {
  // Ensure serviceAccount is a non-empty string before trying to parse
  if (serviceAccount && typeof serviceAccount === 'string' && serviceAccount.trim() !== '') {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(serviceAccount)),
        });
    } catch (e: any) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it's a valid JSON string.", e.message);
    }
  } else {
    console.warn(
      'Firebase Admin SDK not initialized. FIREBASE_SERVICE_ACCOUNT_KEY is missing or empty.'
    );
  }
}

const adminAuth = admin.apps.length ? getAuth() : null;

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
