import { cookies, headers } from "next/headers";

export async function internalGet<T>(path: string): Promise<T> {
  const cookieHeader = cookies().toString();
  const host = headers().get("host") ?? "";
  const url = new URL(path, `http://${host}`).toString();

  const res = await fetch(url, {
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status}`);
  }

  return (await res.json()) as T;
}
