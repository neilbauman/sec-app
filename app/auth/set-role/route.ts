import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { AppRole } from "@/lib/role";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") as AppRole | null;

  if (!role) {
    return NextResponse.json({ error: "Missing role" }, { status: 400 });
  }

  // Write cookie
  const res = NextResponse.redirect(new URL("/dashboard", req.url));
  res.cookies.set("role", role, {
    path: "/",
    httpOnly: false,
  });
  return res;
}
