export const prerender = false;
export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    admin_pw: !!(process.env.ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD),
    github_client: !!(process.env.GITHUB_CLIENT_ID || import.meta.env.GITHUB_CLIENT_ID),
    github_secret: !!(process.env.GITHUB_CLIENT_SECRET || import.meta.env.GITHUB_CLIENT_SECRET),
    sheet: !!(process.env.SHEET_URL || import.meta.env.SHEET_URL),
  }), { headers: { 'Content-Type': 'application/json' } });
}
