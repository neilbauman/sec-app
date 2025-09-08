// app/comprehensive/api/list/route.ts
import { NextResponse } from "next/server";
import { getServerClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getServerClient();

    // 1. Fetch all tables, keyed by their real columns
    const [pillars, themes, subthemes, indicators] = await Promise.all([
      supabase.from("pillars").select("code, name, description, sort_order").order("sort_order"),
      supabase.from("themes").select("code, pillar_code, name, description, sort_order").order("sort_order"),
      supabase.from("subthemes").select("code, theme_code, name, description, sort_order").order("sort_order"),
      supabase.from("indicators").select("code, name, description, sort_order, theme_code, subtheme_code").order("sort_order")
    ]);

    if (pillars.error) throw pillars.error;
    if (themes.error) throw themes.error;
    if (subthemes.error) throw subthemes.error;
    if (indicators.error) throw indicators.error;

    return NextResponse.json({
      ok: true,
      pillars: pillars.data ?? [],
      themes: themes.data ?? [],
      subthemes: subthemes.data ?? [],
      indicators: indicators.data ?? []
    });
  } catch (err: any) {
    console.error("Comprehensive list error", err);
    return NextResponse.json({ ok: false, message: err.message });
  }
}
