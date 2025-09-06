'use server';

import mysql from 'mysql2/promise';

type UserData = {
  uid: string;
  email?: string;
  name?: string | null;
  avatar?: string;
};

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

export async function saveUser(user: UserData) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const sql = `
      INSERT INTO users (id, email, name, photo_url, created_at, last_login_at)
      VALUES (?, ?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        photo_url = VALUES(photo_url),
        last_login_at = NOW();
    `;
    await connection.execute(sql, [user.uid, user.email, user.name, user.avatar]);
    return { success: true };
  } catch (error: any) {
    console.error('Lỗi lưu người dùng vào CSDL:', error);
    // Trả về lỗi chi tiết để gỡ lỗi phía client
    return { success: false, error: `Lỗi CSDL: ${error.message}` };
  }
  finally {
    if (connection) {
      await connection.end();
    }
  }
}
