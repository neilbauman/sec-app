// app/auth/set-role/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") ?? "public";

  // Store role in cookie
  cookies().set("role", role, { path: "/", httpOnly: false });

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
