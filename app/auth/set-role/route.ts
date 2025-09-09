// app/auth/set-role/route.ts
import { NextResponse } from "next/server";

type AppRole = "public" | "country-admin" | "super-admin";

// We use a route param ?role=super-admin and set a cookie via the response
export async function GET(req: Request) {
  const url = new URL(req.url);
  const role = (url.searchParams.get("role") || "public") as AppRole;

  const res = NextResponse.redirect(new URL("/dashboard", req.url));

  // Set a non-HttpOnly cookie so your server components and client can read it if needed.
  // (If you plan to use this for real auth later, you’ll switch to HttpOnly + JWT/session.)
  res.cookies.set("role", role, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    // Session cookie by default
  });

  return res;
}
