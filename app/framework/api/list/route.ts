import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = {
    ok: true,
    counts: { pillars: 2, themes: 3, subthemes: 5 },
    pillars: [
      { code: 'P1', name: 'Safety', description: '', sort_order: 1 },
      { code: 'P2', name: 'Dignity', description: '', sort_order: 2 }
    ],
    themes: [
      { code: 'T1', pillar_code: 'P1', name: 'Shelter Quality', sort_order: 1 },
      { code: 'T2', pillar_code: 'P1', name: 'Security', sort_order: 2 },
      { code: 'T3', pillar_code: 'P2', name: 'Accessibility', sort_order: 1 }
    ],
    subthemes: [
      { code: 'S1', theme_code: 'T1', name: 'Roofing', sort_order: 1 },
      { code: 'S2', theme_code: 'T1', name: 'Insulation', sort_order: 2 },
      { code: 'S3', theme_code: 'T2', name: 'Locks', sort_order: 1 },
      { code: 'S4', theme_code: 'T3', name: 'Ramps', sort_order: 1 },
      { code: 'S5', theme_code: 'T3', name: 'Signage', sort_order: 2 }
    ]
  }
  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
}
