// app/_debug/internal-auth/route.ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const envToken = process.env.INTERNAL_API_TOKEN ?? ''
  const hdrToken = request.headers.get('x-internal-token') ?? ''

  const safe = (s: string) => ({
    len: s.length,
    start3: s.slice(0, 3), // show just first 3 chars for sanity check
  })

  const equal = envToken.length > 0 && hdrToken === envToken

  return NextResponse.json({
    ok: true,
    hasEnv: envToken.length > 0,
    hasHeader: hdrToken.length > 0,
    equal,
    envPreview: safe(envToken),
    headerPreview: safe(hdrToken),
    note:
      'This route is temporary for debugging. Remove after tests pass. Using header name x-internal-token.',
  })
}
