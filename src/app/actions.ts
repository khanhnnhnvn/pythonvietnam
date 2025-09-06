
'use server';

import type { BlogPost, Job, PostFormData, JobFormData, ApplicationFormData, Application } from '@/lib/types';
import mysql from 'mysql2/promise';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getServerSideUser } from '@/lib/firebase-admin';
import { getUserById as getAppUserById } from '@/app/actions';

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
        const [rows] = await connection.execute<mysql.RowDataPacket[]>('SELECT * FROM posts ORDER BY created_at DESC');
        
        const formattedRows = rows.map(post => ({
            ...post,
            date: new Date(post.created_at).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })
        }));

        return formattedRows as BlogPost[];
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
        const [rows] = await connection.execute<mysql.RowDataPacket[]>('SELECT * FROM posts WHERE id = ?', [id]);
        if (rows.length === 0) return null;
        
        const post = rows[0];
        post.date = new Date(post.created_at).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        return post as BlogPost;
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
        const [rows] = await connection.execute<mysql.RowDataPacket[]>('SELECT * FROM posts WHERE slug = ?', [slug]);
        if (rows.length === 0) return null;
        
        const post = rows[0];
        post.date = new Date(post.created_at).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        return post as BlogPost;
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
    const user = await getServerSideUser();
    if (!user) {
        return { success: false, error: 'Unauthorized: You must be logged in to create a post.' };
    }
    const appUser = await getAppUserById(user.uid);
     if (appUser?.role !== 'admin') {
        return { success: false, error: 'Permission denied.' };
    }

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
    const user = await getServerSideUser();
    if (!user) {
        return { success: false, error: 'Unauthorized' };
    }
    const appUser = await getAppUserById(user.uid);
     if (appUser?.role !== 'admin') {
        return { success: false, error: 'Permission denied.' };
    }

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
    const user = await getServerSideUser();
    if (!user) {
        return { success: false, error: 'Unauthorized' };
    }
    const appUser = await getAppUserById(user.uid);
     if (appUser?.role !== 'admin') {
        return { success: false, error: 'Permission denied.' };
    }

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
export async function getJobs(forAdminPage = false): Promise<Job[]> {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        
        let sql = `
            SELECT j.*, COUNT(a.id) as application_count
            FROM jobs j
            LEFT JOIN applications a ON j.id = a.job_id
        `;
        const params: (string | number)[] = [];

        if (forAdminPage) {
            const user = await getServerSideUser();
            if (user) {
                const appUser = await getAppUserById(user.uid);
                if (appUser?.role !== 'admin') {
                    sql += ' WHERE j.user_id = ?';
                    params.push(user.uid);
                }
            } else {
                return []; // Not logged in, cannot see admin jobs page
            }
        }

        sql += `
            GROUP BY j.id
            ORDER BY j.created_at DESC
        `;

        const [rows] = await connection.execute<mysql.RowDataPacket[]>(sql, params);
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
    const user = await getServerSideUser();
    if (!user) {
        return { success: false, error: 'Unauthorized: You must be logged in to create a job.' };
    }
     const appUser = await getAppUserById(user.uid);
     if (appUser?.role !== 'admin') {
        return { success: false, error: 'Permission denied.' };
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const sql = `
            INSERT INTO jobs (user_id, title, slug, company, location, type, category, description, companyLogoUrl, companyLogoHint)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        await connection.execute(sql, [user.uid, data.title, data.slug, data.company, data.location, data.type, data.category, data.description, data.companyLogoUrl, data.companyLogoHint]);
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
    const user = await getServerSideUser();
    if (!user) {
        return { success: false, error: 'Unauthorized' };
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const jobToUpdate = await getJobById(id);
        if (!jobToUpdate) {
            return { success: false, error: 'Job not found.' };
        }

        const appUser = await getAppUserById(user.uid);
        if (appUser?.role !== 'admin' && jobToUpdate.user_id !== user.uid) {
            return { success: false, error: 'Permission denied.' };
        }
        
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
     const user = await getServerSideUser();
    if (!user) {
        return { success: false, error: 'Unauthorized' };
    }
    
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        const jobToDelete = await getJobById(id);
        if (!jobToDelete) {
             return { success: false, error: 'Job not found.' };
        }

        const appUser = await getAppUserById(user.uid);
        if (appUser?.role !== 'admin' && jobToDelete.user_id !== user.uid) {
            return { success: false, error: 'Permission denied.' };
        }

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

// Application Actions
export async function getApplicationsByJobId(jobId: number): Promise<Application[]> {
    const user = await getServerSideUser();
    if (!user) {
        return [];
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        
        const job = await getJobById(jobId);
        if (!job) {
            throw new Error("Job not found");
        }
        const appUser = await getAppUserById(user.uid);
        if (appUser?.role !== 'admin' && job.user_id !== user.uid) {
             throw new Error("Permission denied to view applications for this job.");
        }

        const [rows] = await connection.execute<mysql.RowDataPacket[]>('SELECT * FROM applications WHERE job_id = ? ORDER BY created_at DESC', [jobId]);
        return rows as Application[];
    } catch (error) {
        console.error('Failed to fetch applications:', error);
        return [];
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}


export async function createApplication(data: ApplicationFormData) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const sql = `
            INSERT INTO applications (job_id, name, email, phone, cv_url)
            VALUES (?, ?, ?, ?, ?);
        `;
        await connection.execute(sql, [data.jobId, data.name, data.email, data.phone, data.cvUrl]);
        return { success: true };
    } catch (error: any) {
        console.error('Failed to create application:', error);
        return { success: false, error: `Database Error: ${error.message}` };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

    