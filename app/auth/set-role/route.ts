// Force dynamic so this route always runs at the edge/server
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

type AppRole = 'public' | 'country-admin' | 'super-admin';

export function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = (url.searchParams.get('role') || '').toLowerCase();

  // Validate/normalize role
  const role: AppRole =
    q === 'super-admin' || q === 'country-admin' || q === 'public'
      ? (q as AppRole)
      : 'public';

  // Build redirect response and set cookie on the response
  const res = NextResponse.redirect(new URL('/dashboard', req.url));
  res.cookies.set({
    name: 'role',
    value: role,
    path: '/',
    httpOnly: false,   // keep it client-readable for your quick-switch UI
    sameSite: 'lax',
    secure: true,      // safe default on Vercel HTTPS
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}
