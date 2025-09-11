// app/framework/api/list/route.ts
import { NextResponse } from "next/server";
import { fetchFrameworkList } from "@/lib/framework";

export async function GET() {
  const data = await fetchFrameworkList();
  return NextResponse.json(data);
}
