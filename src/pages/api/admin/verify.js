export const prerender = false;

export async function GET({ locals }) {
  return Response.json({ ok: true, username: locals.user.username });
}
