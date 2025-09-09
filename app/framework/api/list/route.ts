// app/framework/api/list/route.ts
import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { createServerClient } from "@supabase/ssr";

type Pillar = { code: string; name: string; description?: string | null; sort_order?: number | null };
type Theme = { code: string; pillar_code: string; name: string; description?: string | null; sort_order?: number | null };
type Subtheme = { code: string; theme_code: string; name: string; description?: string | null; sort_order?: number | null };

export type FrameworkList = {
  ok: boolean;
  source: "supabase" | "stub";
  counts: { pillars: number; themes: number; subthemes: number };
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

// --- helper: create a server-side Supabase client using request cookies
function getServerClient() {
  const cookieStore = cookies();
  const requestHeaders = headers();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  // We use anon key; RLS must allow read OR you must be signed in appropriately.
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: () => {},
      remove: () => {},
    },
    headers: {
      get: (key: string) => requestHeaders.get(key) ?? undefined,
    },
  });
}

// --- safe stub used if DB read fails
function stubbed(): FrameworkList {
  return {
    ok: true,
    source: "stub",
    counts: { pillars: 2, themes: 0, subthemes: 0 },
    pillars: [
      { code: "P1", name: "Safety", description: "Stub data" },
      { code: "P2", name: "Dignity", description: "Stub data" },
    ],
    themes: [],
    subthemes: [],
  };
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // If env vars are missing, don't blow up — just return stub
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json(stubbed(), { status: 200 });
    }

    const supabase = getServerClient();

    // Adjust table names and column names here if your schema differs.
    // These names match what the UI expects: code, name, description, sort_order, and foreign code fields.
    const [{ data: pillars, error: pErr }, { data: themes, error: tErr }, { data: subthemes, error: sErr }] =
      await Promise.all([
        supabase.from("pillars").select("code,name,description,sort_order").order("sort_order", { ascending: true }),
        supabase
          .from("themes")
          .select("code,pillar_code,name,description,sort_order")
          .order("sort_order", { ascending: true }),
        supabase
          .from("subthemes")
          .select("code,theme_code,name,description,sort_order")
          .order("sort_order", { ascending: true }),
      ]);

    // Any read error -> fall back to stub
    if (pErr || tErr || sErr || !pillars || !themes || !subthemes) {
      return NextResponse.json(stubbed(), { status: 200 });
    }

    const payload: FrameworkList = {
      ok: true,
      source: "supabase",
      counts: { pillars: pillars.length, themes: themes.length, subthemes: subthemes.length },
      pillars,
      themes,
      subthemes,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (_err) {
    // Defensive: never crash the page
    return NextResponse.json(stubbed(), { status: 200 });
  }
}
