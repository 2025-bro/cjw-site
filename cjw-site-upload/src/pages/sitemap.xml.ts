import { getCollection } from 'astro:content';

/** 站点地图：只收录公开页面，内部区 / 登录页不收录 */
export async function GET() {
  const [blog, templates, problems] = await Promise.all([
    getCollection('blog'),
    getCollection('templates'),
    getCollection('problems'),
  ]);

  const base = 'https://cjw-wjc-qwq.top';
  const staticPaths = ['', '/blog/', '/templates/', '/problems/', '/search/', '/guide/', '/about/'];
  const urls = [
    ...staticPaths.map((p) => `${base}${p}`),
    ...blog.map((e) => `${base}/blog/${e.id}/`),
    ...templates.map((e) => `${base}/templates/${e.id}/`),
    ...problems.map((e) => `${base}/problems/${e.id}/`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
