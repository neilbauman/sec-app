// app/framework/api/list/route.ts
import { NextResponse } from "next/server";
import { createClientOnServer } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createClientOnServer();
  // ...
  return NextResponse.json({ ok: true });
}
