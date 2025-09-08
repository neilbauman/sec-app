// app/comprehensive/api/list/route.ts
import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

type Row = Record<string, any>;

function pickFirst<T = any>(row: Row, keys: string[], fallback?: T): T | undefined {
  for (const k of keys) if (k in row && row[k] != null) return row[k] as T;
  return fallback;
}

function normalizeIndicators(rows: Row[]) {
  return rows.map((r) => {
    const code = pickFirst<string>(r, ["code", "indicator_code", "ind_code", "indicatorCode"]);
    const name = pickFirst<string>(r, ["name", "indicator_name", "title"]);
    const description = pickFirst<string>(r, ["description", "desc", "details", "indicator_description"]);
    const sort_order = pickFirst<number>(r, ["sort_order", "sort", "order", "position"], 0);

    // links (support both code- and id-style names, snake/camel)
    const theme_code = pickFirst<string>(r, ["theme_code", "themeCode", "theme_id", "themeId"]);
    const subtheme_code = pickFirst<string>(r, ["subtheme_code", "sub_theme_code", "subthemeCode", "subtheme_id", "subthemeId"]);

    return { code, name, description, sort_order, theme_code, subtheme_code, _raw: r };
  });
}

export async function GET() {
  try {
    const supabase = getServerClient();

    // Known-good columns for these three (based on your working /framework list)
    const [pillars, themes, subthemes] = await Promise.all([
      supabase.from("pillars").select("code, name, description, sort_order").order("sort_order", { ascending: true }),
      supabase.from("themes").select("code, pillar_code, name, description, sort_order").order("sort_order", { ascending: true }),
      supabase.from("subthemes").select("code, theme_code, name, description, sort_order").order("sort_order", { ascending: true }),
    ]);

    if (pillars.error) throw pillars.error;
    if (themes.error) throw themes.error;
    if (subthemes.error) throw subthemes.error;

    // Indicators: select '*' to avoid column errors; sort later in JS if a sort column exists
    const indicatorsResp = await supabase.from("indicators").select("*");
    if (indicatorsResp.error) throw indicatorsResp.error;

    const normalizedIndicators = normalizeIndicators(indicatorsResp.data ?? []);
    // stable sort if sort_order present
    normalizedIndicators.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

    return NextResponse.json({
      ok: true,
      pillars: pillars.data ?? [],
      themes: themes.data ?? [],
      subthemes: subthemes.data ?? [],
      indicators: normalizedIndicators,
    });
  } catch (err: any) {
    console.error("Comprehensive list error:", err?.message || err);
    return NextResponse.json({ ok: false, message: String(err?.message ?? err) });
  }
}
