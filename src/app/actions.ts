'use server';

import { cookies } from 'next/headers';
import { admin } from '@/lib/firebase-admin';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

async function saveUserToDb(user: { uid: string; email: string | undefined; name: string | null; avatar: string | undefined; }) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const sql = `
      INSERT INTO users (id, email, name, avatar_url, created_at, last_login_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        avatar_url = VALUES(avatar_url),
        last_login_at = NOW();
    `;
    await connection.execute(sql, [user.uid, user.email, user.name, user.avatar]);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function createSession(idToken: string) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    const user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || null,
        avatar: decodedToken.picture || undefined,
    };
    
    await saveUserToDb(user);

    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error creating session:', error);
    return { success: false, error: 'Failed to create session.' };
  }
}

export async function clearSession() {
  cookies().delete('session');
}
