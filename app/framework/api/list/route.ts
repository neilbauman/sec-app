// app/framework/api/list/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Mirror the shapes you use in the editor
export type Pillar = {
  code: string;
  name: string;
  description?: string | null;
};

export type Theme = {
  code: string;
  name: string;
  pillar_code: string;
  description?: string | null;
};

export type Subtheme = {
  code: string;
  name: string;
  theme_code: string;
  description?: string | null;
};

export type FrameworkList = {
  ok: true;
  counts: { pillars: number; themes: number; subthemes: number };
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

// NOTE:
// To keep builds stable and avoid the Next 15 cookies()/headers() typing changes,
// we construct a plain Supabase client with anon key here. This assumes your RLS
// allows read for anon or you’re otherwise making the data publicly readable.
// (No schema changes are made here.)

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { ok: false, message: "Supabase env vars missing" },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Fetch data in parallel
  const [pillarsRes, themesRes, subthemesRes] = await Promise.all([
    supabase.from("pillars").select("*"),
    supabase.from("themes").select("*"),
    supabase.from("subthemes").select("*"),
  ]);

  // Handle any one failing
  const anyError = pillarsRes.error || themesRes.error || subthemesRes.error;
  if (anyError) {
    return NextResponse.json(
      { ok: false, message: anyError!.message },
      // 401 if you’re hitting RLS, or 500 otherwise — 401 tends to be more useful here
      { status: 401 }
    );
  }

  const pillars = (pillarsRes.data ?? []) as Pillar[];
  const themes = (themesRes.data ?? []) as Theme[];
  const subthemes = (subthemesRes.data ?? []) as Subtheme[];

  const payload: FrameworkList = {
    ok: true,
    counts: {
      pillars: pillars.length,
      themes: themes.length,
      subthemes: subthemes.length,
    },
    pillars,
    themes,
    subthemes,
  };

  return NextResponse.json(payload, { status: 200 });
}
