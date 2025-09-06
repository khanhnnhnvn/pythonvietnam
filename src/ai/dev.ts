'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-blog-post.ts';
import '@/ai/flows/generate-blog-post-flow.ts';
import '@/ai/flows/parse-cv-flow.ts';
