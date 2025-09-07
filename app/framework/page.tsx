// app/framework/page.tsx
'use client';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React, { useEffect, useState } from 'react';

/**
 * Minimal, read-only viewer:
 * - Renders the page title "Primary Framework Editor"
 * - Calls /framework/api/list to fetch pillars/themes/subthemes
 * - Shows a tiny nested list to confirm data flows end-to-end
 * - No editing, no actions, no Supabase client in the browser
 */
type Pillar = { id: string; code?: string; name?: string; description?: string };
type Theme = { id: string; pillar_id?: string; code?: string; name?: string; description?: string };
type Subtheme = { id: string; theme_id?: string; code?: string; name?: string; description?: string };

export default function FrameworkPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [subthemes, setSubthemes] = useState<Subtheme[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/framework/api/list', { cache: 'no-store' });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || `API error (${res.status})`);
        }
        const data = await res.json();
        if (!mounted) return;
        setPillars(Array.isArray(data.pillars) ? data.pillars : []);
        setThemes(Array.isArray(data.themes) ? data.themes : []);
        setSubthemes(Array.isArray(data.subthemes) ? data.subthemes : []);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || 'Unknown error');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Simple helpers to group children
  const themesByPillar = new Map<string, Theme[]>();
  const subthemesByTheme = new Map<string, Subtheme[]>();
  for (const t of themes) {
    if (!t.pillar_id) continue;
    if (!themesByPillar.has(t.pillar_id)) themesByPillar.set(t.pillar_id, []);
    themesByPillar.get(t.pillar_id)!.push(t);
  }
  for (const s of subthemes) {
    if (!s.theme_id) continue;
    if (!subthemesByTheme.has(s.theme_id)) subthemesByTheme.set(s.theme_id, []);
    subthemesByTheme.get(s.theme_id)!.push(s);
  }

  return (
    <main style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        Primary Framework Editor
      </h1>

      {loading && <div>Loading…</div>}
      {error && (
        <div style={{ color: 'crimson', marginTop: 8 }}>
          Error: {error}
        </div>
      )}

      {!loading && !error && (
        <div style={{
          border: '1px solid #eee',
          borderRadius: 8,
          padding: 16,
          background: '#fff'
        }}>
          <div style={{ marginBottom: 12, color: '#666' }}>
            This is a minimal, read-only view to confirm data flow. No edits or actions yet.
          </div>

          {/* Extremely simple nested rendering to validate hierarchy */}
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {pillars.map(pillar => (
              <li key={pillar.id} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 600 }}>
                  {pillar.code ? `[${pillar.code}] ` : ''}{pillar.name || 'Untitled Pillar'}
                </div>
                {pillar.description && (
                  <div style={{ color: '#666', marginLeft: 8, marginTop: 4 }}>
                    {pillar.description}
                  </div>
                )}

                <ul style={{ listStyle: 'none', paddingLeft: 16, marginTop: 8 }}>
                  {(themesByPillar.get(pillar.id) || []).map(theme => (
                    <li key={theme.id} style={{ marginBottom: 8 }}>
                      <div>
                        {theme.code ? `[${theme.code}] ` : ''}{theme.name || 'Untitled Theme'}
                      </div>
                      {theme.description && (
                        <div style={{ color: '#666', marginLeft: 8, marginTop: 2 }}>
                          {theme.description}
                        </div>
                      )}

                      <ul style={{ listStyle: 'none', paddingLeft: 16, marginTop: 4 }}>
                        {(subthemesByTheme.get(theme.id) || []).map(st => (
                          <li key={st.id} style={{ marginBottom: 6 }}>
                            <div>
                              {st.code ? `[${st.code}] ` : ''}{st.name || 'Untitled Subtheme'}
                            </div>
                            {st.description && (
                              <div style={{ color: '#666', marginLeft: 8, marginTop: 2 }}>
                                {st.description}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          {/* Tiny footer with counts */}
          <div style={{ marginTop: 12, fontSize: 12, color: '#888' }}>
            {pillars.length} pillars, {themes.length} themes, {subthemes.length} subthemes
          </div>
        </div>
      )}
    </main>
  );
}
