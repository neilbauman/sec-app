// app/admin/framework/primary/editor/page.tsx

"use client";

import React, { useState } from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { PageHeader, CsvActions } from "@/lib/ui";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";
import { Pillar, Theme, Subtheme } from "@/types/framework";

// ---------- Error Boundary ----------
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        <p className="font-medium">Render Error</p>
        <pre className="text-xs mt-2 whitespace-pre-wrap">
          {error.message}
        </pre>
      </div>
    );
  }

  return (
    <React.ErrorBoundary
      fallbackRender={({ error }) => {
        setError(error);
        return null;
      }}
    >
      {children}
    </React.ErrorBoundary>
  );
}

// ---------- Fetch Data ----------
async function getData(): Promise<{
  pillars: (Pillar & { themes: (Theme & { subthemes: Subtheme[] })[] })[];
  error?: string;
}> {
  try {
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: () => ({
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {
            /* server no-op */
          },
          remove() {
            /* server no-op */
          },
        }),
      }
    );

    // ✅ Fetch pillars, themes, and subthemes
    const { data, error } = await supabase
      .from("pillars")
      .select("id, name, code, description, sort_order, themes(id, name, code, description, sort_order, subthemes(id, name, code, description, sort_order)))")
      .order("sort_order");

    if (error) throw error;

    return { pillars: (data as any) || [] };
  } catch (err: any) {
    console.error("getData error:", err);
    return { pillars: [], error: err.message };
  }
}

// ---------- Page ----------
export default async function PrimaryFrameworkEditorPage() {
  const { pillars, error } = await getData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Primary Framework Editor"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Admin", href: "/admin" },
          { label: "Framework", href: "/admin/framework" },
          { label: "Primary Editor" },
        ]}
        actions={<CsvActions />}
      />

      <div className="p-6 space-y-6">
        {/* Debug JSON */}
        <div className="card p-4">
          <h2 className="font-medium mb-2">Debug Data</h2>
          {error ? (
            <pre className="text-red-600 text-sm">{error}</pre>
          ) : (
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(pillars, null, 2)}
            </pre>
          )}
        </div>

        {/* Cards with Error Boundary */}
        <ErrorBoundary>
          <PrimaryFrameworkCards
            pillars={pillars}
            defaultOpen={false}
            actions={(item, level) => (
              <div className="flex space-x-2 text-sm text-gray-500">
                <button className="hover:text-gray-700">✏️ Edit</button>
                <button className="hover:text-gray-700">🗑️ Delete</button>
                <button className="hover:text-gray-700">➕ Add</button>
              </div>
            )}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}
