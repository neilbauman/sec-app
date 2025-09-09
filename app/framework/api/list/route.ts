// app/framework/api/list/route.ts
// Public read-only list endpoint (no roles, no cookies)

import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

type Pillar = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Theme = {
  id: string;
  code: string;
  pillar_code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Subtheme = {
  id: string;
  code: string;
  theme_code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type FrameworkList = {
  ok: true;
  counts: { pillars: number; themes: number; subthemes: number };
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

export async function GET() {
  try {
    const supabase = getServerClient();

    const [{ data: pillars, error: pErr }, { data: themes, error: tErr }, { data: subthemes, error: sErr }] =
      await Promise.all([
        supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
        supabase.from('themes').select('*').order('sort_order', { ascending: true }),
        supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
      ]);

    if (pErr || tErr || sErr) {
      const firstErr = pErr ?? tErr ?? sErr;
      return NextResponse.json({ ok: false, message: firstErr?.message ?? 'Query error' }, { status: 500 });
    }

    const response: FrameworkList = {
      ok: true,
      counts: {
        pillars: pillars?.length ?? 0,
        themes: themes?.length ?? 0,
        subthemes: subthemes?.length ?? 0,
      },
      pillars: pillars ?? [],
      themes: themes ?? [],
      subthemes: subthemes ?? [],
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? 'Unexpected error' }, { status: 500 });
  }
}
