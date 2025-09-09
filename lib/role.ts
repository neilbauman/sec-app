import { cookies } from "next/headers";

export type AppRole = "super-admin" | "country-admin" | "public";

export function getCurrentRole(): AppRole {
  try {
    const role = cookies().get("role")?.value as AppRole | undefined;
    if (role === "super-admin" || role === "country-admin" || role === "public") {
      return role;
    }
  } catch {
    // cookie not available (e.g. build-time)
  }
  return "public";
}

export function roleLabel(role: AppRole): string {
  if (role === "super-admin") return "Super Admin";
  if (role === "country-admin") return "Country Admin";
  return "Public";
}
