'use server';

import type { BlogPost, Job, PostFormData, JobFormData } from '@/lib/types';
import mysql from 'mysql2/promise';
import fs from 'node:fs/promises';
import path from 'node:path';

type UserData = {
  uid: string;
  email?: string;
  name?: string | null;
  avatar?: string;
  role?: string;
};

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

// User Actions
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
    return { success: false, error: `Lỗi CSDL: ${error.message}` };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function getUserById(userId: string): Promise<UserData | null> {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows]: any[] = await connection.execute('SELECT id, email, name, photo_url, role FROM users WHERE id = ?', [userId]);
    if (rows.length > 0) {
      const user = rows[0];
      return {
        uid: user.id,
        email: user.email,
        name: user.name,
        avatar: user.photo_url,
        role: user.role
      };
    }
    return null;
  } catch (error) {
    console.error('Lỗi lấy thông tin người dùng:', error);
    return null;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Post Actions
export async function getPosts(): Promise<BlogPost[]> {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute<mysql.RowDataPacket[]>('SELECT *, DATE_FORMAT(created_at, "%Y-%m-%d") as date FROM posts ORDER BY created_at DESC');
        return rows as BlogPost[];
    } catch (error) {
        console.error('Failed to fetch posts:', error);
        return [];
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

export async function getPostById(id: number): Promise<BlogPost | null> {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute<mysql.RowDataPacket[]>('SELECT *, DATE_FORMAT(created_at, "%Y-%m-%d") as date FROM posts WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] as BlogPost : null;
    } catch (error) {
        console.error(`Failed to fetch post with id ${id}:`, error);
        return null;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute<mysql.RowDataPacket[]>('SELECT *, DATE_FORMAT(created_at, "%Y-%m-%d") as date FROM posts WHERE slug = ?', [slug]);
        return rows.length > 0 ? rows[0] as BlogPost : null;
    } catch (error) {
        console.error(`Failed to fetch post with slug ${slug}:`, error);
        return null;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

export async function createPost(data: PostFormData) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const sql = `
            INSERT INTO posts (slug, title, author, category, description, imageUrl, imageHint, content)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;
        await connection.execute(sql, [data.slug, data.title, data.author, data.category, data.description, data.imageUrl, data.imageHint, data.content]);
        return { success: true };
    } catch (error: any) {
        console.error('Failed to create post:', error);
        return { success: false, error: `Database Error: ${error.message}` };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

export async function updatePost(id: number, data: PostFormData) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const sql = `
            UPDATE posts SET slug = ?, title = ?, author = ?, category = ?, description = ?, imageUrl = ?, imageHint = ?, content = ?
            WHERE id = ?;
        `;
        await connection.execute(sql, [data.slug, data.title, data.author, data.category, data.description, data.imageUrl, data.imageHint, data.content, id]);
        return { success: true };
    } catch (error: any) {
        console.error('Failed to update post:', error);
        return { success: false, error: `Database Error: ${error.message}` };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

export async function deletePost(id: number) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM posts WHERE id = ?', [id]);
        return { success: true };
    } catch (error: any) {
        console.error('Failed to delete post:', error);
        return { success: false, error: `Database Error: ${error.message}` };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}


export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File;

  if (!file) {
    return { success: false, error: 'No file provided.' };
  }
  if (file.size === 0) {
    return { success: false, error: 'File is empty.' };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    
    await fs.mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, buffer);

    const fileUrl = `/uploads/${filename}`;
    
    return { success: true, url: fileUrl };
  } catch (error: any) {
    console.error('File upload failed:', error);
    return { success: false, error: `File upload failed: ${error.message}` };
  }
}


// Job Actions
export async function getJobs(): Promise<Job[]> {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute<mysql.RowDataPacket[]>('SELECT *, slug FROM jobs ORDER BY created_at DESC');
        return rows as Job[];
    } catch (error) {
        console.error('Failed to fetch jobs:', error);
        return [];
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}


export async function getJobById(id: number): Promise<Job | null> {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute<mysql.RowDataPacket[]>('SELECT * FROM jobs WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] as Job : null;
    } catch (error) {
        console.error(`Failed to fetch job with id ${id}:`, error);
        return null;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute<mysql.RowDataPacket[]>('SELECT * FROM jobs WHERE slug = ?', [slug]);
        return rows.length > 0 ? rows[0] as Job : null;
    } catch (error) {
        console.error(`Failed to fetch job with slug ${slug}:`, error);
        return null;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

export async function createJob(data: JobFormData) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const sql = `
            INSERT INTO jobs (title, slug, company, location, type, category, description, companyLogoUrl, companyLogoHint)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        await connection.execute(sql, [data.title, data.slug, data.company, data.location, data.type, data.category, data.description, data.companyLogoUrl, data.companyLogoHint]);
        return { success: true };
    } catch (error: any) {
        console.error('Failed to create job:', error);
        return { success: false, error: `Database Error: ${error.message}` };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

export async function updateJob(id: number, data: JobFormData) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const sql = `
            UPDATE jobs SET title = ?, slug = ?, company = ?, location = ?, type = ?, category = ?, description = ?, companyLogoUrl = ?, companyLogoHint = ?
            WHERE id = ?;
        `;
        await connection.execute(sql, [data.title, data.slug, data.company, data.location, data.type, data.category, data.description, data.companyLogoUrl, data.companyLogoHint, id]);
        return { success: true };
    } catch (error: any) {
        console.error('Failed to update job:', error);
        return { success: false, error: `Database Error: ${error.message}` };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

export async function deleteJob(id: number) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM jobs WHERE id = ?', [id]);
        return { success: true };
    } catch (error: any) {
        console.error('Failed to delete job:', error);
        return { success: false, error: `Database Error: ${error.message}` };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

