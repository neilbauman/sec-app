import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { NestedPillar } from "@/lib/types";

export async function POST(req: Request) {
  const supabase = createClient();
  const body = await req.json();

  const pillars: NestedPillar[] = body.pillars;

  // Example: save to Supabase (adjust table name & structure)
  const { error } = await supabase
    .from("framework")
    .upsert({ id: "framework", pillars });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
