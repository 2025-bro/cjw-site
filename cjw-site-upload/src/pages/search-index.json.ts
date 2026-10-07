import { getCollection } from 'astro:content';

/** 生成供站内搜索使用的 JSON 索引（只包含公开内容，不含内部区） */
export async function GET() {
  const [blog, templates, problems] = await Promise.all([
    getCollection('blog'),
    getCollection('templates'),
    getCollection('problems'),
  ]);

  const items = [
    ...blog.map((e) => ({
      type: '博客',
      title: e.data.title,
      desc: e.data.description,
      tags: e.data.tags,
      url: `/blog/${e.id}/`,
      text: e.body ?? '',
    })),
    ...templates.map((e) => ({
      type: '代码模板',
      title: e.data.title,
      desc: e.data.description,
      tags: [e.data.category, ...e.data.tags],
      url: `/templates/${e.id}/`,
      text: e.body ?? '',
    })),
    ...problems.map((e) => ({
      type: '题目解析',
      title: `${e.data.platform} ${e.data.problemId} · ${e.data.title}`,
      desc: e.data.difficulty,
      tags: e.data.tags,
      url: `/problems/${e.id}/`,
      text: e.body ?? '',
    })),
  ];

  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
