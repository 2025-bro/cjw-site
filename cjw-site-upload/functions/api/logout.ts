export const onRequest = async ({ request }: { request: Request }) => {
  const url = new URL('/login/', request.url);
  return new Response(null, {
    status: 303,
    headers: {
      Location: url.toString(),
      'Set-Cookie': 'cjw_auth=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0',
    },
  });
};
