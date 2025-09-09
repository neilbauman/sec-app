// app/framework/api/list/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const dynamic = "force-dynamic";

type Pillar = { code: string; name: string; description?: string | null; sort_order?: number | null };
type Theme = { code: string; pillar_code: string; name: string; description?: string | null; sort_order?: number | null };
type Subtheme = { code: string; theme_code: string; name: string; description?: string | null; sort_order?: number | null };

type FrameworkList = {
  counts: { pillars: number; themes: number; subthemes: number };
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

function getSupabaseServerClient() {
  const cookieStore = cookies();

  // NOTE: @supabase/ssr v0.5 – only cookies, no headers
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // no-ops are fine; we only read in this route
        set() {},
        remove() {},
      },
    }
  );
}

export async function GET() {
  try {
    // If env isn’t configured, return an empty shape (keeps UI working)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const empty: FrameworkList = {
        counts: { pillars: 0, themes: 0, subthemes: 0 },
        pillars: [],
        themes: [],
        subthemes: [],
      };
      return NextResponse.json(empty, { status: 200 });
    }

    const supabase = getSupabaseServerClient();

    // Adjust table names/columns here to match your schema.
    const { data: pillars, error: pErr } = await supabase
      .from("pillars")
      .select("code,name,description,sort_order")
      .order("sort_order", { ascending: true });

    const { data: themes, error: tErr } = await supabase
      .from("themes")
      .select("code,pillar_code,name,description,sort_order")
      .order("sort_order", { ascending: true });

    const { data: subthemes, error: sErr } = await supabase
      .from("subthemes")
      .select("code,theme_code,name,description,sort_order")
      .order("sort_order", { ascending: true });

    // If RLS blocks anonymous reads you’ll see 401/permission errors here.
    // We still return 200 with whatever succeeded so the UI can render.
    const payload: FrameworkList = {
      counts: {
        pillars: pillars?.length ?? 0,
        themes: themes?.length ?? 0,
        subthemes: subthemes?.length ?? 0,
      },
      pillars: (pillars as Pillar[]) ?? [],
      themes: (themes as Theme[]) ?? [],
      subthemes: (subthemes as Subtheme[]) ?? [],
    };

    // You can inspect pErr/tErr/sErr in server logs if needed
    return NextResponse.json(payload, { status: 200 });
  } catch (err: any) {
    // Defensive default – keeps the page rendering and surfaces error in logs
    console.error("GET /framework/api/list failed:", err);
    return NextResponse.json({ ok: false, message: "Failed to load framework list" }, { status: 500 });
  }
}
