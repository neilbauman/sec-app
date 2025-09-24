// app/api/framework/route.ts
import { NextResponse } from "next/server";
import { getFrameworkFromDb } from "@/lib/framework-server";

export async function GET() {
  try {
    const framework = await getFrameworkFromDb();
    return NextResponse.json(framework);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
