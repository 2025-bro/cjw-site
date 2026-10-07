import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default('CJW'),
    tags: z.array(z.string()).default([]),
  }),
});

const templates = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/templates' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['数据结构', '图论', '数学', '字符串', '动态规划', '其他']),
    tags: z.array(z.string()).default([]),
    author: z.string().default('CJW'),
    date: z.coerce.date(),
  }),
});

const problems = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/problems' }),
  schema: z.object({
    title: z.string(),
    platform: z.enum(['洛谷', 'Codeforces', 'AtCoder', 'LeetCode', 'USACO', '其他']),
    problemId: z.string(),
    problemUrl: z.string(),
    difficulty: z.enum(['入门', '普及', '提高', '省选']),
    tags: z.array(z.string()).default([]),
    author: z.string().default('CJW'),
    date: z.coerce.date(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/private' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().default('CJW'),
  }),
});

export const collections = { blog, templates, problems, notes };
