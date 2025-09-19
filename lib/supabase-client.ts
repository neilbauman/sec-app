// lib/supabase-client.ts
"use client";

import { createClient } from "./supabase-browser";

/**
 * Singleton Supabase client instance for client-side usage.
 * Import this in React components/hooks when you need Supabase.
 */
export const supabase = createClient();
