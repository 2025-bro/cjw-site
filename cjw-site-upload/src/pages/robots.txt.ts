export function GET() {
  return new Response(
    `User-agent: *
Disallow: /private/
Disallow: /login/
Disallow: /api/

Sitemap: https://cjw-wjc-qwq.top/sitemap.xml
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}
