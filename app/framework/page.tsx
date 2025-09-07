'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useMemo, useState } from 'react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ---- Minimal types (loose & future-proof) -------------------------------
type Pillar = { id: number; code?: string | null; name?: string | null; description?: string | null };
type Theme = { id: number; pillar_id?: number | null; code?: string | null; name?: string | null; description?: string | null };
type Subtheme = { id: number; theme_id?: number | null; code?: string | null; name?: string | null; description?: string | null };

type HierNode = Pillar & { themes: Array<Theme & { subthemes: Subtheme[] }> };

// ---- Helper: env (client) -----------------------------------------------
function getEnvOrThrow(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}. Add it to your Vercel project env vars.`);
  return v;
}

export default function FrameworkPage() {
  // 1) create browser client safely in the component
  const supabase: SupabaseClient = useMemo(() => {
    const url = getEnvOrThrow('NEXT_PUBLIC_SUPABASE_URL');
    const key = getEnvOrThrow('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return createClient(url, key);
  }, []);

  // 2) local state for read-only rendering
  const [data, setData] = useState<HierNode[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // 3) fetch on mount (client only)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);
      try {
        // Adjust column names if yours differ — these are the common ones we’ve used.
        const [{ data: pillars, error: pErr }, { data: themes, error: tErr }, { data: subs, error: sErr }] =
          await Promise.all([
            supabase.from('pillars').select('id, code, name, description').order('code', { ascending: true }),
            supabase.from('themes').select('id, pillar_id, code, name, description').order('code', { ascending: true }),
            supabase.from('subthemes').select('id, theme_id, code, name, description').order('code', { ascending: true }),
          ]);

        if (pErr || tErr || sErr) {
          throw new Error([pErr?.message, tErr?.message, sErr?.message].filter(Boolean).join(' | '));
        }

        const byPillar = new Map<number, HierNode>();
        (pillars ?? []).forEach((p) => byPillar.set(p.id, { ...p, themes: [] }));

        const byTheme = new Map<number, Theme & { subthemes: Subtheme[] }>();
        (themes ?? []).forEach((t) => {
          const themeNode = { ...t, subthemes: [] as Subtheme[] };
          byTheme.set(t.id, themeNode);
          const parent = t.pillar_id ? byPillar.get(t.pillar_id) : undefined;
          if (parent) parent.themes.push(themeNode);
        });

        (subs ?? []).forEach((s) => {
          const parent = s.theme_id ? byTheme.get(s.theme_id) : undefined;
          if (parent) parent.subthemes.push(s);
        });

        const tree = Array.from(byPillar.values());
        if (!cancelled) setData(tree);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  // 4) UI (read-only)
  return (
    <main style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', lineHeight: 1.5 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Primary Framework Editor</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Read-only view. No editing yet. We&apos;re just confirming clean client-only data reads.
      </p>

      {loading && <div>Loading framework…</div>}
      {err && (
        <div style={{ color: '#b00020', background: '#ffe9ec', padding: 12, borderRadius: 8, marginBottom: 12 }}>
          Error loading data: {err}
        </div>
      )}

      {!loading && !err && (!data || data.length === 0) && <div>No framework data found.</div>}

      {!loading && !err && data && data.length > 0 && (
        <div style={{ display: 'grid', gap: 12 }}>
          {data.map((p) => (
            <section key={p.id} style={{ border: '1px solid #eee', borderRadius: 10, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 12,
                    padding: '2px 8px',
                    borderRadius: 999,
                    background: '#e6f0ff',
                    color: '#1e55b3',
                    textTransform: 'uppercase',
                    letterSpacing: 0.3,
                  }}
                >
                  pillar
                </span>
                <strong>{p.code ?? '[no code]'}</strong>
                <span>— {p.name ?? '[no name]'}</span>
              </div>
              {p.description && <p style={{ color: '#555', marginBottom: 8 }}>{p.description}</p>}

              {p.themes.length > 0 ? (
                <ul style={{ margin: '6px 0 0 18px' }}>
                  {p.themes.map((t) => (
                    <li key={t.id} style={{ marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span
                          style={{
                            fontSize: 11,
                            padding: '1px 6px',
                            borderRadius: 999,
                            background: '#e9f8ef',
                            color: '#196d3a',
                            textTransform: 'uppercase',
                            letterSpacing: 0.3,
                          }}
                        >
                          theme
                        </span>
                        <strong>{t.code ?? '[no code]'}</strong>
                        <span>— {t.name ?? '[no name]'}</span>
                      </div>
                      {t.description && <div style={{ color: '#666', marginLeft: 0 }}>{t.description}</div>}

                      {t.subthemes.length > 0 && (
                        <ul style={{ margin: '6px 0 0 18px' }}>
                          {t.subthemes.map((s) => (
                            <li key={s.id} style={{ marginBottom: 4 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span
                                  style={{
                                    fontSize: 10,
                                    padding: '0px 6px',
                                    borderRadius: 999,
                                    background: '#fff4d6',
                                    color: '#8a5a00',
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.3,
                                  }}
                                >
                                  subtheme
                                </span>
                                <strong>{s.code ?? '[no code]'}</strong>
                                <span>— {s.name ?? '[no name]'}</span>
                              </div>
                              {s.description && <div style={{ color: '#777', marginLeft: 0 }}>{s.description}</div>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ color: '#777' }}>No themes under this pillar.</div>
              )}
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
