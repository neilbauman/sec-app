// app/framework/api/list/route.ts
import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabaseServer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ ok: false, status: 401, message }, { status: 401 });
}

function checkAuth(req: Request) {
  const expected = process.env.INTERNAL_API_TOKEN || '';
  const got = req.headers.get('x-internal-token') || '';
  if (!expected || got !== expected) return false;
  return true;
}

export async function GET(req: Request) {
  if (!checkAuth(req)) return unauthorized();

  const supabase = getServerClient();

  const counts = { pillars: 0, themes: 0, subthemes: 0 };
  let pillars: any[] = [];
  let themes: any[] = [];
  let subthemes: any[] = [];

  // Pillars
  {
    const { data, error } = await supabase
      .from('pillars')
      .select('code,name,description,sort_order')
      .order('sort_order', { ascending: true });
    if (!error && data) {
      pillars = data;
      counts.pillars = data.length;
    }
  }

  // Themes
  {
    const { data, error } = await supabase
      .from('themes')
      .select('code,pillar_code,name,description,sort_order')
      .order('sort_order', { ascending: true });
    if (!error && data) {
      themes = data;
      counts.themes = data.length;
    }
  }

  // Sub-themes
  {
    const { data, error } = await supabase
      .from('subthemes')
      .select('code,theme_code,name,description,sort_order')
      .order('sort_order', { ascending: true });
    if (!error && data) {
      subthemes = data;
      counts.subthemes = data.length;
    }
  }

  return NextResponse.json({ ok: true, counts, pillars, themes, subthemes });
}
