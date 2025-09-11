// app/framework/api/list/route.ts
import { NextResponse } from "next/server";
import { fetchFramework } from "@/lib/framework";

export async function GET() {
  const data = await fetchFramework();
  return NextResponse.json(data);
}
