import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

/**
 * 宽松版内容配置
 * ------------------------------------------------------------
 * 目的：写内容时不再被格式卡住，任何字段缺省、留空、填任意值
 * 都不会导致构建失败（也就是不会出现「提交后网站没更新/报错」）。
 *
 * - title / description / author 等文本：留空或缺少时会用默认值；
 * - date：支持 2026-10-09、2026/10/09，留空或写错自动用当天日期；
 * - category / platform / difficulty：**自由填写**，不再限定固定选项，
 *   列表页的筛选按钮会根据你实际填过的值自动生成；
 * - tags：支持 [a, b] 写法，也支持 “a，b”“a、b”“a b” 写法，自动拆分去重。
 */

// 文本：null / 缺省 / 空白 -> 默认值；其它类型自动转成字符串
const text = (fallback = '') =>
  z.preprocess((v) => {
    if (v === null || v === undefined) return fallback;
    const s = String(v).trim();
    return s === '' ? fallback : s;
  }, z.string());

// 日期：空 / 格式不对 -> 用当天日期，绝不报错
const dateText = () =>
  z.preprocess((v) => {
    const raw = v === null || v === undefined ? '' : String(v).trim();
    if (raw === '') return new Date();
    const d = new Date(raw.replace(/\//g, '-').replace(' ', 'T'));
    return Number.isNaN(d.getTime()) ? new Date() : d;
  }, z.date());

// 标签：数组或分隔字符串都接受，自动拆分、去空、去重
const tagList = () =>
  z.preprocess((v) => {
    const raw = Array.isArray(v) ? v : v === null || v === undefined ? [] : [v];
    const out: string[] = [];
    for (const item of raw) {
      for (const piece of String(item).split(/[,，、;；|\s]+/)) {
        const t = piece.trim();
        if (t && !out.includes(t)) out.push(t);
      }
    }
    return out;
  }, z.array(z.string()));

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: text('未命名文章'),
    description: text(''),
    date: dateText(),
    author: text('CJW'),
    tags: tagList(),
  }),
});

const templates = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/templates' }),
  schema: z.object({
    title: text('未命名模板'),
    description: text(''),
    category: text('其他'), // 自由填写：数据结构 / 知识专题 / 杂项 …… 想写什么写什么
    tags: tagList(),
    author: text('CJW'),
    date: dateText(),
  }),
});

const problems = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/problems' }),
  schema: z.object({
    title: text('未命名题目'),
    platform: text('其他'), // 自由填写：洛谷 / CCF CSP / AcWing / 牛客 …… 想写什么写什么
    problemId: text(''),
    problemUrl: text(''),
    difficulty: text('未分级'), // 自由填写：入门 / 普及+ / 提高+ / Div.2 C / 省一 …… 想写什么写什么
    tags: tagList(),
    author: text('CJW'),
    date: dateText(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/private' }),
  schema: z.object({
    title: text('未命名笔记'),
    date: dateText(),
    author: text('CJW'),
  }),
});

export const collections = { blog, templates, problems, notes };
