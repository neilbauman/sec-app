'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ReloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';

// ---- Supabase client (robust to export differences) -------------------
import * as supa from '@/lib/supabaseClient';

// helper to always return a usable browser client
const getSb = () =>
  (supa as any).getBrowserClient?.() ??
  (supa as any).createBrowserClient?.() ??
  (supa as any).createClient?.() ??
  supa;

// ---- Types (minimal) -------------------------------------------------------
type Level = 'pillar' | 'theme' | 'subtheme';

type PillarRow = {
  id: number | string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type ThemeRow = {
  id: number | string;
  code: string;
  pillar_code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type SubthemeRow = {
  id: number | string;
  code: string;
  theme_code: string;
  pillar_code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

// What we actually render as flat rows (built from the 3 tables)
type UIRow =
  | { key: string; level: 'pillar'; code: string; name: string; description?: string | null }
  | { key: string; level: 'theme'; code: string; parentP: string; name: string; description?: string | null }
  | { key: string; level: 'subtheme'; code: string; parentP: string; parentT: string; name: string; description?: string | null };

// ---- Small UI helpers ------------------------------------------------------
const Badge: React.FC<{ label: string; tone: 'blue' | 'green' | 'red' }> = ({ label, tone }) => {
  const bg =
    tone === 'blue' ? 'rgba(79,140,255,.12)' : tone === 'green' ? 'rgba(28,184,65,.12)' : 'rgba(255,86,48,.12)';
  const fg =
    tone === 'blue' ? '#2b6de9' : tone === 'green' ? '#1a7f2e' : '#b42b17';
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: 12,
        lineHeight: '18px',
        background: bg,
        color: fg,
        textTransform: 'lowercase',
        marginRight: 8,
      }}
    >
      {label}
    </span>
  );
};

const CodeChip: React.FC<{ code: string }> = ({ code }) => (
  <span style={{ fontSize: 12, color: '#8e8e93', marginLeft: 4 }}>[{code}]</span>
);

// caret
const Caret: React.FC<{ open: boolean; onClick: () => void; disabled?: boolean }> = ({ open, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={open ? 'Collapse' : 'Expand'}
    style={{
      border: 'none',
      background: 'transparent',
      width: 24,
      height: 24,
      borderRadius: 6,
      cursor: disabled ? 'default' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
      color: '#4a4a4a',
    }}
  >
    <span style={{ display: 'inline-block', transform: `rotate(${open ? 90 : 0}deg)`, transition: 'transform .15s' }}>
      ▶
    </span>
  </button>
);

// ---- Page ------------------------------------------------------------------
export default function FrameworkPage() {
  const supabase = useMemo(() => getSb(), []);
  const [loading, setLoading] = useState(false);

  // expanded holds IDs like `P:P1`, `T:T1.2`
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // data
  const [pillars, setPillars] = useState<PillarRow[]>([]);
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [subs, setSubs] = useState<SubthemeRow[]>([]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: p }, { data: t }, { data: s }] = await Promise.all([
        supabase.from('pillars').select('*').order('sort_order', { ascending: true }),
        supabase.from('themes').select('*').order('sort_order', { ascending: true }),
        supabase.from('subthemes').select('*').order('sort_order', { ascending: true }),
      ]);
      setPillars(p ?? []);
      setThemes(t ?? []);
      setSubs(s ?? []);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Build parent -> children maps (guarantees children render under the correct parent)
  const themesByPillar = useMemo(() => {
    const m = new Map<string, ThemeRow[]>();
    for (const th of themes) {
      if (!m.has(th.pillar_code)) m.set(th.pillar_code, []);
      m.get(th.pillar_code)!.push(th);
    }
    // stable order (themes already ordered by sort_order)
    return m;
  }, [themes]);

  const subsByTheme = useMemo(() => {
    const m = new Map<string, SubthemeRow[]>();
    for (const st of subs) {
      if (!m.has(st.theme_code)) m.set(st.theme_code, []);
      m.get(st.theme_code)!.push(st);
    }
    return m;
  }, [subs]);

  // Deterministic flattening driven ONLY by parent–child relations + expanded state
  const flatRows: UIRow[] = useMemo(() => {
    const out: UIRow[] = [];

    for (const p of pillars) {
      const pKey = `P:${p.code}`;
      out.push({ key: pKey, level: 'pillar', code: p.code, name: p.name, description: p.description ?? '' });

      if (!expanded[pKey]) continue;

      const ths = themesByPillar.get(p.code) ?? [];
      for (const t of ths) {
        const tKey = `T:${t.code}`;
        out.push({
          key: tKey,
          level: 'theme',
          code: t.code,
          parentP: p.code,
          name: t.name,
          description: t.description ?? '',
        });

        if (!expanded[tKey]) continue;

        const subsOfT = subsByTheme.get(t.code) ?? [];
        for (const st of subsOfT) {
          const sKey = `S:${st.code}`;
          out.push({
            key: sKey,
            level: 'subtheme',
            code: st.code,
            parentP: p.code,
            parentT: t.code,
            name: st.name,
            description: st.description ?? '',
          });
        }
      }
    }

    return out;
  }, [pillars, themesByPillar, subsByTheme, expanded]);

  // toggle helpers
  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = { ...prev };
      next[key] = !next[key];
      return next;
    });

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    for (const p of pillars) next[`P:${p.code}`] = true;
    for (const t of themes) next[`T:${t.code}`] = true;
    setExpanded(next);
  };
  const collapseAll = () => setExpanded({});

  // ---- Styles: 2-column responsive with percentage widths ------------------
  const rowGrid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '58% 42%',
    gap: '16px',
    alignItems: 'center',
    padding: '14px 16px',
  };

  const nameCellStyle = (level: Level): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    paddingLeft: level === 'pillar' ? 4 : level === 'theme' ? 28 : 52,
    minHeight: 28,
  });

  // ---- Render --------------------------------------------------------------
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#111' }}>
          <ArrowLeftOutlined /> Dashboard
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 8px 0 12px' }}>Framework Editor</h1>
        <div style={{ flex: 1 }} />
        <button
          onClick={fetchAll}
          disabled={loading}
          style={{
            border: '1px solid #e5e5ea',
            borderRadius: 8,
            padding: '6px 12px',
            background: '#fff',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <ReloadOutlined />
          Refresh
        </button>
        <button
          onClick={collapseAll}
          style={{ marginLeft: 8, border: '1px solid #e5e5ea', borderRadius: 8, padding: '6px 10px', background: '#fff' }}
        >
          Collapse all
        </button>
        <button
          onClick={expandAll}
          style={{ marginLeft: 8, border: '1px solid #e5e5ea', borderRadius: 8, padding: '6px 10px', background: '#fff' }}
        >
          Expand all
        </button>
      </div>

      {/* Header row */}
      <div
        style={{
          ...rowGrid,
          fontWeight: 600,
          color: '#6b7280',
          borderBottom: '1px solid #eee',
          position: 'sticky',
          top: 0,
          background: '#fafafa',
          zIndex: 1,
        }}
      >
        <div>Name</div>
        <div>Description / Notes</div>
      </div>

      {/* Data rows */}
      <div style={{ borderTop: '1px solid #f0f0f0' }}>
        {flatRows.map((r) => {
          const isP = r.level === 'pillar';
          const isT = r.level === 'theme';
          const caretKey = isP ? `P:${r.code}` : isT ? `T:${r.code}` : '';
          const canExpand = r.level !== 'subtheme';
          const open = canExpand ? !!expanded[caretKey] : false;

          return (
            <div key={r.key} style={{ ...rowGrid, borderBottom: '1px solid #f5f5f5' }}>
              {/* Name column */}
              <div style={nameCellStyle(r.level)}>
                <Caret open={open} onClick={() => (canExpand ? toggle(caretKey) : undefined)} disabled={!canExpand} />
                {r.level === 'pillar' && (
                  <>
                    <Badge label="pillar" tone="blue" />
                    <CodeChip code={r.code} />
                  </>
                )}
                {r.level === 'theme' && (
                  <>
                    <Badge label="theme" tone="green" />
                    <CodeChip code={r.code} />
                  </>
                )}
                {r.level === 'subtheme' && (
                  <>
                    <Badge label="sub-theme" tone="red" />
                    <CodeChip code={r.code} />
                  </>
                )}
                <span style={{ fontSize: 16, fontWeight: 600, color: '#111' }}>{r.name}</span>
              </div>

              {/* Description column */}
              <div style={{ fontSize: 14, color: '#2a2a2a' }}>{r.description || ''}</div>
            </div>
          );
        })}

        {!loading && flatRows.length === 0 && (
          <div style={{ padding: 32, color: '#6b7280' }}>No data</div>
        )}
        {loading && (
          <div style={{ padding: 32, color: '#6b7280' }}>Loading…</div>
        )}
      </div>
    </div>
  );
}
