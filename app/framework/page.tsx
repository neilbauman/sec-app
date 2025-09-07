'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React, { useEffect, useMemo, useState } from 'react';
import { getBrowserClient } from '@/lib/supabaseBrowser';

type PillarRow = {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type ThemeRow = {
  id: number;
  pillar_id: number;         // FK → pillars.id
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type SubthemeRow = {
  id: number;
  theme_id: number;          // FK → themes.id
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Expanded = {
  pillars: Set<number>;
  themes: Set<number>;
};

export default function PrimaryFrameworkEditor() {
  const supabase = useMemo(() => getBrowserClient(), []);
  const [loading, setLoading] = useState(true);
  const [pillars, setPillars] = useState<PillarRow[]>([]);
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [subs, setSubs] = useState<SubthemeRow[]>([]);
  const [expanded, setExpanded] = useState<Expanded>({
    pillars: new Set<number>(),
    themes: new Set<number>(),
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      // fetch all 3 tables in parallel, ordered by sort_order then id as tiebreaker
      const [{ data: p }, { data: t }, { data: s }] = await Promise.all([
        supabase.from('pillars').select('*').order('sort_order', { ascending: true }).order('id', { ascending: true }),
        supabase.from('themes').select('*').order('sort_order', { ascending: true }).order('id', { ascending: true }),
        supabase.from('subthemes').select('*').order('sort_order', { ascending: true }).order('id', { ascending: true }),
      ]);
      if (!mounted) return;
      setPillars((p || []) as PillarRow[]);
      setThemes((t || []) as ThemeRow[]);
      setSubs((s || []) as SubthemeRow[]);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [supabase]);

  const themesByPillar = useMemo(() => {
    const map = new Map<number, ThemeRow[]>();
    for (const th of themes) {
      const list = map.get(th.pillar_id) || [];
      list.push(th);
      map.set(th.pillar_id, list);
    }
    return map;
  }, [themes]);

  const subsByTheme = useMemo(() => {
    const map = new Map<number, SubthemeRow[]>();
    for (const st of subs) {
      const list = map.get(st.theme_id) || [];
      list.push(st);
      map.set(st.theme_id, list);
    }
    return map;
  }, [subs]);

  const togglePillar = (id: number) =>
    setExpanded((e) => ({ ...e, pillars: new Set(e.pillars.has(id) ? [...e.pillars].filter(x => x !== id) : [...e.pillars, id]) }));
  const toggleTheme = (id: number) =>
    setExpanded((e) => ({ ...e, themes: new Set(e.themes.has(id) ? [...e.themes].filter(x => x !== id) : [...e.themes, id]) }));

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>Primary Framework Editor</h1>

      {loading ? (
        <div>Loading framework…</div>
      ) : (
        <div role="table" aria-label="SSC Framework" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <div role="row" style={{ display: 'grid', gridTemplateColumns: '60% 40%', fontWeight: 600, padding: '8px 12px' }}>
            <div>Name</div>
            <div>Description / Notes</div>
          </div>

          {/* Pillars */}
          {pillars.map((p) => {
            const openP = expanded.pillars.has(p.id);
            const pThemes = themesByPillar.get(p.id) || [];
            return (
              <div key={`pillar-${p.id}`} role="rowgroup" style={{ borderTop: '1px solid #eee' }}>
                <div role="row" style={{ display: 'grid', gridTemplateColumns: '60% 40%', alignItems: 'center', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      aria-label={openP ? 'Collapse pillar' : 'Expand pillar'}
                      onClick={() => togglePillar(p.id)}
                      style={{
                        width: 22, height: 22, borderRadius: 4, border: '1px solid #ccc',
                        background: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: '18px'
                      }}
                    >
                      {openP ? '−' : '+'}
                    </button>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ background: '#e6f0ff', color: '#2457c5', border: '1px solid #c9dbff', borderRadius: 8, padding: '2px 8px', fontSize: 12 }}>
                        pillar
                      </span>
                      <span style={{ color: '#99a3b3', fontSize: 12, fontFamily: 'monospace' }}>[{p.code}]</span>
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                    </span>
                  </div>
                  <div style={{ color: '#444' }}>{p.description || ''}</div>
                </div>

                {/* Themes under this pillar */}
                {openP && pThemes.map((t) => {
                  const openT = expanded.themes.has(t.id);
                  const tSubs = subsByTheme.get(t.id) || [];
                  return (
                    <div key={`theme-${t.id}`} role="rowgroup" style={{ paddingLeft: 34 }}>
                      <div role="row" style={{ display: 'grid', gridTemplateColumns: '60% 40%', alignItems: 'center', padding: '8px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button
                            aria-label={openT ? 'Collapse theme' : 'Expand theme'}
                            onClick={() => toggleTheme(t.id)}
                            style={{
                              width: 22, height: 22, borderRadius: 4, border: '1px solid #ccc',
                              background: '#fff', cursor: 'pointer', fontSize: 14, lineHeight: '18px'
                            }}
                          >
                            {openT ? '−' : '+'}
                          </button>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ background: '#eaffea', color: '#2a7a2a', border: '1px solid #c7efc7', borderRadius: 8, padding: '2px 8px', fontSize: 12 }}>
                              theme
                            </span>
                            <span style={{ color: '#99a3b3', fontSize: 12, fontFamily: 'monospace' }}>[{t.code}]</span>
                            <span>{t.name}</span>
                          </span>
                        </div>
                        <div style={{ color: '#444' }}>{t.description || ''}</div>
                      </div>

                      {/* Subthemes under this theme */}
                      {openT && tSubs.map((s) => (
                        <div key={`sub-${s.id}`} role="row" style={{ display: 'grid', gridTemplateColumns: '60% 40%', alignItems: 'center', padding: '6px 12px 6px 56px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 22, height: 22 }} />
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ background: '#fff6e6', color: '#a66a00', border: '1px solid #ffe0b2', borderRadius: 8, padding: '2px 8px', fontSize: 12 }}>
                                subtheme
                              </span>
                              <span style={{ color: '#99a3b3', fontSize: 12, fontFamily: 'monospace' }}>[{s.code}]</span>
                              <span>{s.name}</span>
                            </span>
                          </div>
                          <div style={{ color: '#444' }}>{s.description || ''}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
