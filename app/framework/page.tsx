'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

type Pillar = {
  code: string;
  name: string;
  description: string | null;
  notes: string | null;
  sort_order: number | null;
};

type Theme = {
  code: string;
  pillar_code: string;
  name: string;
  description: string | null;
  notes: string | null;
  sort_order: number | null;
};

type Subtheme = {
  code: string;
  pillar_code: string;   // denormalized is fine (present in your schema)
  theme_code: string;
  name: string;
  description: string | null;
  notes: string | null;
  sort_order: number | null;
};

type Row = {
  key: string;
  level: 'pillar' | 'theme' | 'subtheme';
  code: string;
  parentKey?: string; // for grouping
  name: string;
  description?: string | null;
  notes?: string | null;
  sortOrder: number;
};

export default function FrameworkEditor() {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const [{ data: pData, error: pErr }, { data: tData, error: tErr }, { data: sData, error: sErr }] =
          await Promise.all([
            supabase.from('pillars').select('code,name,description,notes,sort_order'),
            supabase.from('themes').select('code,pillar_code,name,description,notes,sort_order'),
            supabase.from('subthemes').select('code,theme_code,pillar_code,name,description,notes,sort_order'),
          ]);

        if (pErr) throw pErr;
        if (tErr) throw tErr;
        if (sErr) throw sErr;

        const pillars = (pData ?? []) as Pillar[];
        const themes = (tData ?? []) as Theme[];
        const subs = (sData ?? []) as Subtheme[];

        // Build flat rows
        const out: Row[] = [];

        const safeNum = (n: number | null | undefined) => (typeof n === 'number' && !Number.isNaN(n) ? n : 0);

        // Pillars
        for (const p of pillars) {
          out.push({
            key: `P|${p.code}`,
            level: 'pillar',
            code: p.code,
            name: p.name,
            description: p.description,
            notes: p.notes,
            sortOrder: safeNum(p.sort_order),
          });
        }

        // Themes
        for (const t of themes) {
          out.push({
            key: `T|${t.pillar_code}|${t.code}`,
            level: 'theme',
            code: t.code,
            parentKey: `P|${t.pillar_code}`,
            name: t.name,
            description: t.description,
            notes: t.notes,
            sortOrder: safeNum(t.sort_order),
          });
        }

        // Subthemes
        for (const s of subs) {
          out.push({
            key: `S|${s.theme_code}|${s.code}`,
            level: 'subtheme',
            code: s.code,
            parentKey: `T|${s.pillar_code}|${s.theme_code}`,
            name: s.name,
            description: s.description,
            notes: s.notes,
            sortOrder: safeNum(s.sort_order),
          });
        }

        // Sort by hierarchy: pillar.sort_order, then theme.sort_order, then subtheme.sort_order
        const sortKey = (r: Row) => {
          // extract codes to tie-break deterministically
          const parts = r.key.split('|');
          return {
            lvl: r.level === 'pillar' ? 0 : r.level === 'theme' ? 1 : 2,
            p: parts[1] ?? '',
            t: parts[2] ?? '',
            s: parts[3] ?? '',
            ord: r.sortOrder,
          };
        };

        out.sort((a, b) => {
          const A = sortKey(a);
          const B = sortKey(b);
          return (
            A.lvl - B.lvl ||
            A.p.localeCompare(B.p) ||
            A.t.localeCompare(B.t) ||
            A.s.localeCompare(B.s) ||
            A.ord - B.ord
          );
        });

        if (!cancelled) setRows(out);
      } catch (e: any) {
        if (!cancelled) setErr(e.message ?? String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    // no realtime for now (we can add channel subscriptions later)
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Framework Editor</h1>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
        <span style={{ opacity: 0.7 }}>Read-only snapshot from database.</span>
        <button
          onClick={() => location.reload()}
          style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: 8, background: '#fff' }}
        >
          Refresh
        </button>
      </div>

      <div
        style={{
          border: '1px solid #eee',
          borderRadius: 12,
          overflow: 'hidden',
          background: '#fff',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '140px 1fr 1.5fr 120px',
            padding: '10px 14px',
            fontWeight: 600,
            background: '#f8f8fb',
            borderBottom: '1px solid #eee',
          }}
        >
          <div>Level</div>
          <div>Name / Code</div>
          <div>Description / Notes</div>
          <div>Parent</div>
        </div>

        {loading ? (
          <div style={{ padding: 28, textAlign: 'center', opacity: 0.6 }}>Loading…</div>
        ) : err ? (
          <div style={{ padding: 16, color: 'crimson' }}>{err}</div>
        ) : rows.length === 0 ? (
          <div style={{ padding: 28, textAlign: 'center', opacity: 0.6 }}>No data</div>
        ) : (
          rows.map((r) => {
            const lvlLabel =
              r.level === 'pillar' ? 'Pillar' : r.level === 'theme' ? 'Theme' : 'Sub-theme';
            const parent =
              r.level === 'pillar'
                ? '—'
                : r.level === 'theme'
                ? r.parentKey?.split('|')[1]
                : r.parentKey?.split('|')[2];

            // subtle row tint per level
            const bg =
              r.level === 'pillar'
                ? 'rgba(221,173,152,0.15)'
                : r.level === 'theme'
                ? 'rgba(146,149,162,0.12)'
                : 'rgba(180,198,231,0.12)';

            return (
              <div
                key={r.key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '140px 1fr 1.5fr 120px',
                  padding: '10px 14px',
                  borderBottom: '1px solid #f1f1f4',
                  background: bg,
                }}
              >
                <div style={{ fontVariant: 'all-small-caps', letterSpacing: 0.4 }}>{lvlLabel}</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  <div style={{ opacity: 0.6, fontSize: 12 }}>Code: {r.code}</div>
                </div>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {[r.description, r.notes].filter(Boolean).join('\n\n')}
                </div>
                <div style={{ opacity: 0.7 }}>{parent ?? '—'}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
