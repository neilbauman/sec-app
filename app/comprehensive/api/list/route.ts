// app/comprehensive/api/list/route.ts

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Intentionally NOT touching Supabase yet.
  // This endpoint simply returns a harmless shape so the page can render.
  // Next step: we’ll join Primary Framework + indicators/levels here (server-only).
  return NextResponse.json({
    ok: true,
    note: 'Scaffold ready. No Supabase calls yet.',
    totals: {
      pillars: 0,
      themes: 0,
      subthemes: 0,
      indicators: 0,
      levels: 0,
    },
  });
}
