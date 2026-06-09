import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    timeStart: z.string().optional(),
    timeEnd: z.string().optional(),
    location: z.string().optional(),
    image: z.string().optional(),
    type: z.enum(['sidang', 'festival', 'konser', 'workshop', 'other']).optional(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
  }),
});

const galeri = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/galeri' }),
  schema: z.object({
    title: z.string(),
    caption: z.string().optional(),
    image: z.string(),
    category: z.string().optional(),
    date: z.coerce.date().optional(),
  }),
});

const dokumen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dokumen' }),
  schema: z.object({
    title: z.string(),
    category: z.string().optional(),
    file: z.string(),
    fileSize: z.string().optional(),
    date: z.coerce.date().optional(),
  }),
});

const people = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    photo: z.string().optional(),
    bio: z.string().optional(),
    category: z.string().optional(),
    order: z.number().optional(),
  }),
});

const quotes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/quotes' }),
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    quote: z.string(),
    photo: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const collections = { posts, events, galeri, dokumen, people, quotes };
