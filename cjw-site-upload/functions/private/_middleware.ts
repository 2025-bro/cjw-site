import { checkAuth } from '../_lib/auth';
import type { CloudflareEnv } from '../_lib/auth';

/**
 * /private/* 下所有静态页面统一走这里：
 * 未登录 -> 302 到登录页；已登录 -> 直接从静态资源目录取文件。
 * 没有这个中间件时，/private/ 目录的 HTML 会被直接公开访问。
 */

async function serveAsset(env: CloudflareEnv, request: Request): Promise<Response> {
  const assets = env.ASSETS;
  if (!assets) {
    return new Response('ASSETS binding unavailable', { status: 500 });
  }
  let res = await assets.fetch(request);
  if (res.status === 404) {
    // 兼容目录形式：/private/note/ -> /private/note/index.html
    const url = new URL(request.url);
    const path = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
    const fallback = await assets.fetch(new Request(new URL(`${path}index.html`, url).toString()));
    if (fallback.status === 200) return fallback;
  }
  return res;
}

export const onRequest = async ({ request, env }: { request: Request; env: CloudflareEnv }) => {
  if (await checkAuth(request, env)) {
    return serveAsset(env, request);
  }
  const target = new URL(request.url);
  const url = new URL('/login/', target.origin);
  url.searchParams.set('next', target.pathname + target.search);
  return Response.redirect(url.toString(), 302);
};
