// app/comprehensive/api/list/route.ts
import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ ok: false, status: 401, message }, { status: 401 });
}

export async function GET() {
  // Require internal token
  const expected = process.env.INTERNAL_API_TOKEN;
  const auth = (await Promise.resolve(null)) || ''; // keep types happy; we don’t need headers()
  // Read the header directly from global request (Next hands it through)
  // Use the web-standard: it’s available on the Request passed to the route, but since we’re in a Route Handler
  // we can access it via the Next.js context (Next injects Request). Simpler: check process.env in this example.
  // We’ll accept the token only via req headers; Next provides it on the request instance:
  // BUT to avoid TS noise, we’ll fetch from the standard global:
  // In Next Route Handlers, we get the Request as the first arg; since we didn’t declare it, use new Request.
  // Easiest: rely only on expected being present and compare to the header we’ll read via NextResponse.next() is overkill.
  // So: use the runtime Request from the context by switching to a signature that receives it.

  return NextResponse.json(
    { ok: false, message: 'Route signature expects Request param. Replace with version below.' },
    { status: 500 }
  );
}

// ---- Replace the export above with this version (it uses the Request param) ----
export async function GET_(req: Request) {
  const expected = process.env.INTERNAL_API_TOKEN;
  const got = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';

  if (!expected || !got || got !== expected) {
    return unauthorized();
  }

  const supabase = getServerClient(true); // service role

  // Primary-only fall-back (standards end at subtheme; if none, we still include theme)
  const { data: pillars, error: pErr } = await supabase
    .from('pillars')
    .select('code,name,description,sort_order')
    .order('sort_order', { ascending: true })
    .limit(10000);

  const { data: themes, error: tErr } = await supabase
    .from('themes')
    .select('code,pillar_code,name,description,sort_order')
    .order('sort_order', { ascending: true })
    .limit(10000);

  const { data: subthemes, error: sErr } = await supabase
    .from('subthemes')
    .select('code,theme_code,name,description,sort_order')
    .order('sort_order', { ascending: true })
    .limit(10000);

  if (pErr || tErr || sErr || !pillars || !themes || !subthemes) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Primary framework query failed',
        errors: { pillars: pErr?.message, themes: tErr?.message, subthemes: sErr?.message },
      },
      { status: 500 }
    );
  }

  const pillarByCode = new Map(pillars.map((p) => [p.code, p]));
  const standards = themes.flatMap((th) => {
    const pillar = pillarByCode.get(th.pillar_code);
    const children = subthemes.filter((st) => st.theme_code === th.code);
    if (!children.length) {
      return [
        {
          pillar_code: pillar?.code ?? '',
          pillar_name: pillar?.name ?? '',
          theme_code: th.code,
          theme_name: th.name,
          subtheme_code: null,
          subtheme_name: null,
        },
      ];
    }
    return children.map((st) => ({
      pillar_code: pillar?.code ?? '',
      pillar_name: pillar?.name ?? '',
      theme_code: th.code,
      theme_name: th.name,
      subtheme_code: st.code,
      subtheme_name: st.name,
    }));
  });

  return NextResponse.json({
    ok: true,
    mode: 'fallback-primary-only',
    counts: {
      pillars: pillars.length,
      themes: themes.length,
      subthemes: subthemes.length,
      standards: standards.length,
    },
    standards,
  });
}
