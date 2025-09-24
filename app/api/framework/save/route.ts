// app/api/framework/save/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { NestedPillar } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const body = await req.json();

    // Ensure incoming data matches our type
    const pillars: NestedPillar[] = body.pillars;

    // Save entire framework as a single row (adjust table/column as needed)
    const { error } = await supabase
      .from("framework")
      .upsert({
        id: "framework", // single-framework pattern
        pillars,
      });

    if (error) {
      console.error("Error saving framework:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Framework save failed:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
