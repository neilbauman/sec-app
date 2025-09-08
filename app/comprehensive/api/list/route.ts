// app/comprehensive/api/list/route.ts
import { NextResponse } from 'next/server'

/**
 * Simple bearer check using INTERNAL_API_TOKEN (server env only).
 * The page calls this route with header: x-internal-token: <token>.
 */
function checkAuth(req: Request) {
  const expected = process.env.INTERNAL_API_TOKEN
  const presented =
    req.headers.get('x-internal-token') ||
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!expected || !presented || presented !== expected) {
    return false
  }
  return true
}

export async function GET(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, status: 401, message: 'Unauthorized' }, { status: 401 })
  }

  // TODO: replace this stub payload with your real DB aggregation once ready.
  // For now we return a small, safe sample so the page can render.
  const payload = {
    ok: true,
    counts: { pillars: 3, themes: 13, subthemes: 32, indicators: 0, levels: 0, criteria: 0 },
    sample: [
      { pillar: 'P1', theme: 'T1.1', subtheme: 'ST1.1.1', indicator: null, level: null, criterion: null },
    ],
  }

  return NextResponse.json(payload, { status: 200 })
}
