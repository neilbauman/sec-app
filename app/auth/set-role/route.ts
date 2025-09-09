// app/auth/set-role/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const role = (url.searchParams.get('role') || 'public') as
    | 'super-admin'
    | 'country-admin'
    | 'public';

  const res = NextResponse.redirect(new URL('/dashboard', req.url));
  // Set cookie on the response (route handlers cannot mutate cookies() directly in Next 15)
  res.cookies.set('role', role, {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
