// app/framework/api/list/route.ts
import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic'; // ensure this never gets prerendered/cached

type Pillar = { id: string; code?: string | null; name?: string | null; description?: string | null };
type Theme = { id: string; pillar_id: string; code?: string | null; name?: string | null; description?: string | null };
type Subtheme = { id: string; theme_id: string; code?: string | null; name?: string | null; description?: string | null };

export async function GET() {
  const supabase = getServerClient();

  // Fetch pillars
  const { data: pillars, error: pErr } = await supabase
    .from('pillars')
    .select('id, code, name, description')
    .order('code', { ascending: true }) as { data: Pillar[] | null; error: any };

  if (pErr) {
    console.error('Pillars error:', pErr);
    return NextResponse.json({ ok: false, error: 'Failed to load pillars' }, { status: 500 });
  }

  // Fetch themes
  const { data: themes, error: tErr } = await supabase
    .from('themes')
    .select('id, pillar_id, code, name, description')
    .order('code', { ascending: true }) as { data: Theme[] | null; error: any };

  if (tErr) {
    console.error('Themes error:', tErr);
    return NextResponse.json({ ok: false, error: 'Failed to load themes' }, { status: 500 });
  }

  // Fetch subthemes
  const { data: subthemes, error: sErr } = await supabase
    .from('subthemes')
    .select('id, theme_id, code, name, description')
    .order('code', { ascending: true }) as { data: Subtheme[] | null; error: any };

  if (sErr) {
    console.error('Subthemes error:', sErr);
    return NextResponse.json({ ok: false, error: 'Failed to load subthemes' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    pillars: pillars ?? [],
    themes: themes ?? [],
    subthemes: subthemes ?? [],
  });
}
