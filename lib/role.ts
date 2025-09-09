import { cookies } from "next/headers";

export type AppRole = "super-admin" | "country-admin" | "public";

export function getCurrentRole(): AppRole {
  try {
    const role = cookies().get("role")?.value as AppRole | undefined;
    if (role === "super-admin" || role === "country-admin" || role === "public") {
      return role;
    }
  } catch {
    // ignore in non-request contexts
  }
  return "public";
}

export function roleLabel(role: AppRole): string {
  switch (role) {
    case "super-admin":
      return "Super Admin";
    case "country-admin":
      return "Country Admin";
    default:
      return "Public User";
  }
}
