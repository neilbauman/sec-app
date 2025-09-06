'use client';

/**
 * ONE stable browser client for the whole app.
 * - No type annotations that conflict with @supabase/ssr generics
 * - Safe to import from client components only
 * - Back-compat aliases so older code keeps working
 */
import { createBrowserClient } from '@supabase/ssr';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getBrowserClient() {
  if (typeof window === 'undefined') {
    // Never call this on the server / during prerender
    throw new Error('getBrowserClient() must be called in the browser.');
  }
  return createBrowserClient(URL, KEY);
}

export default getBrowserClient;

// Back-compat named exports (so previous imports don’t break)
export { getBrowserClient };
// Some of your files import ‘createClient’—map that to the same thing:
export const createClient = getBrowserClient;
