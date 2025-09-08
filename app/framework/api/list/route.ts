// app/framework/api/list/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-side only

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    if (!URL || !SERVICE_KEY) {
      return NextResponse.json(
        { ok: false, error: 'Missing SUPABASE env vars' },
        { status: 500 }
      );
    }

    const supabase = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });

    const [{ data: pillars, error: pErr }, { data: themes, error: tErr }, { data: subthemes, error: sErr }] =
      await Promise.all([
        supabase.from('pillars').select('code, name, description, sort_order').order('sort_order', { ascending: true }),
        supabase.from('themes').select('code, pillar_code, name, description, sort_order').order('sort_order', { ascending: true }),
        supabase.from('subthemes').select('code, theme_code, name, description, sort_order').order('sort_order', { ascending: true }),
      ]);

    if (pErr || tErr || sErr) {
      return NextResponse.json(
        { ok: false, error: (pErr || tErr || sErr)?.message ?? 'Query error' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      pillars: pillars ?? [],
      themes: themes ?? [],
      subthemes: subthemes ?? [],
      totals: {
        pillars: pillars?.length ?? 0,
        themes: themes?.length ?? 0,
        subthemes: subthemes?.length ?? 0,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}
