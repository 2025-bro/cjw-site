// Cloudflare Pages Functions 共用鉴权工具（functions/ 目录内的私有模块，_ 前缀不会映射为路由）

export interface CloudflareEnv {
  PASSWORD?: string;
  SITE_SECRET?: string;
  ASSETS?: { fetch: (request: Request) => Promise<Response> };
}

const COOKIE_NAME = 'cjw_auth';
const AUTH_MESSAGE = 'cjw-authed-v1';

/** HMAC-SHA256，返回 hex 字符串 */
export async function hmacHex(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** 校验登录 Cookie。secret 未配置时一律拒绝访问。 */
export async function checkAuth(request: Request, env: CloudflareEnv): Promise<boolean> {
  const secret = env.SITE_SECRET;
  if (!secret) return false;
  const header = request.headers.get('cookie') ?? '';
  const token = header
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
  if (!token) return false;
  const expected = await hmacHex(secret, AUTH_MESSAGE);
  return token === expected;
}

/** 校验提交的密码（用 HMAC 比较，避免时序攻击） */
export async function checkPassword(input: string, env: CloudflareEnv): Promise<boolean> {
  const stored = env.PASSWORD;
  const secret = env.SITE_SECRET;
  if (!stored || !secret) return false;
  const a = await hmacHex(secret, `pw:${input}`);
  const b = await hmacHex(secret, `pw:${stored}`);
  return a === b;
}

/** 生成登录成功后的 Cookie 值 */
export function authCookieValue(token: string): string {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=2592000`;
}

/** 安全地规整 next 跳转目标：只允许站内绝对路径 */
export function safeNext(raw: string | null | undefined, fallback = '/private/'): string {
  if (raw && raw.startsWith('/') && !raw.startsWith('//')) return raw;
  return fallback;
}
