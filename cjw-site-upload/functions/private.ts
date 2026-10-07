import { checkAuth } from './_lib/auth';
import type { CloudflareEnv } from './_lib/auth';

// 处理不带斜杠的 /private，统一跳到 /private/（由 _middleware 接管鉴权）
export const onRequest = async ({ request, env }: { request: Request; env: CloudflareEnv }) => {
  if (await checkAuth(request, env)) {
    return Response.redirect(new URL('/private/', request.url).toString(), 302);
  }
  const url = new URL('/login/', request.url);
  url.searchParams.set('next', '/private/');
  return Response.redirect(url.toString(), 302);
};
