import { checkPassword, authCookieValue, hmacHex, safeNext } from '../_lib/auth';
import type { CloudflareEnv } from '../_lib/auth';

export const onRequestGet = async ({ request }: { request: Request }) =>
  Response.redirect(new URL('/login/', request.url).toString(), 302);

export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request;
  env: CloudflareEnv;
}) => {
  const form = await request.formData();
  const password = (form.get('password') as string | null) ?? '';
  const next = safeNext((form.get('next') as string | null) ?? undefined);

  if (!(await checkPassword(password, env))) {
    const url = new URL('/login/', request.url);
    url.searchParams.set('error', '1');
    url.searchParams.set('next', next);
    return Response.redirect(url.toString(), 303);
  }

  const secret = env.SITE_SECRET ?? '';
  const token = await hmacHex(secret, 'cjw-authed-v1');
  return new Response(null, {
    status: 303,
    headers: {
      Location: next,
      'Set-Cookie': authCookieValue(token),
    },
  });
};
