// app/comprehensive/api/list/route.ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' satisfies 'force-dynamic'
export const revalidate = 0

function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ ok: false, status: 401, message }, { status: 401 })
}

export async function GET(req: Request) {
  // Internal token guard (Option A)
  const headerToken = req.headers.get('x-internal-token') || ''
  const envToken = process.env.INTERNAL_API_TOKEN || ''

  if (!envToken) {
    return NextResponse.json(
      { ok: false, status: 500, message: 'INTERNAL_API_TOKEN is not configured on the server' },
      { status: 500 }
    )
  }
  if (headerToken !== envToken) {
    return unauthorized()
  }

  // TODO: replace with real queries once tables are ready.
  // For now, return a stub so the page renders.
  return NextResponse.json({
    ok: true,
    counts: {
      pillars: 0,
      themes: 0,
      subthemes: 0,
      indicators: 0,
      levels: 0,
      criteria: 0,
    },
    sample: [{ pillar: null, theme: null, indicator: null, level: null, criterion: null }],
  })
}
