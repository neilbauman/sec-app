// app/framework/page.tsx
'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Pillar = {
  id: number | string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Theme = {
  id: number | string;
  pillar_id: number | string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Subtheme = {
  id: number | string;
  theme_id: number | string;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type ListPayload = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

export default function PrimaryFrameworkEditor() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<ListPayload>({
    pillars: [],
    themes: [],
    subthemes: [],
  });

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  // Read-only fetch via our own API route to avoid DB calls in the page component.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch('/framework/api/list', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const payload: ListPayload = await res.json();
        if (!cancelled) setData(payload);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || 'Failed to load framework');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Build parent→children maps (by ID, never by array index).
  const themesByPillar = useMemo(() => {
    const m = new Map<string | number, Theme[]>();
    for (const t of data.themes) {
      const key = t.pillar_id;
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(t);
    }
    for (const arr of m.values()) arr.sort(sortByOrderThenCode);
    return m;
  }, [data.themes]);

  const subsByTheme = useMemo(() => {
    const m = new Map<string | number, Subtheme[]>();
    for (const s of data.subthemes) {
      const key = s.theme_id;
      if (!m.has(key)) m.set(key, []);
      m.get(key)!.push(s);
    }
    for (const arr of m.values()) arr.sort(sortByOrderThenCode);
    return m;
  }, [data.subthemes]);

  const pillarsSorted = useMemo(() => {
    const copy = [...data.pillars];
    copy.sort(sortByOrderThenCode);
    return copy;
  }, [data.pillars]);

  function toggle(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="fw-wrap">
      <div className="fw-header">
        <Link href="/" className="fw-back">Dashboard</Link>
        <h1>Primary Framework Editor (read-only)</h1>
        <button className="fw-refresh" onClick={() => location.reload()}>Refresh</button>
      </div>

      {loading && <div className="fw-note">Loading framework…</div>}
      {err && <div className="fw-error">Error: {err}</div>}

      {!loading && !err && (
        <div className="fw-table">
          <div className="fw-thead">
            <div className="fw-th fw-col-name">Name</div>
            <div className="fw-th fw-col-desc">Description / Notes</div>
          </div>

          <div className="fw-tbody">
            {pillarsSorted.map((p) => {
              const pid = String(p.id);
              const tOfP = themesByPillar.get(p.id) || [];
              const isPExpanded = expanded.has(`P:${pid}`);
              return (
                <div key={`P:${pid}`}>
                  <Row
                    level="pillar"
                    code={p.code}
                    name={p.name}
                    desc={p.description}
                    expanded={isPExpanded}
                    onToggle={() => toggle(`P:${pid}`)}
                  />
                  {isPExpanded &&
                    tOfP.map((t) => {
                      const tid = String(t.id);
                      const sOfT = subsByTheme.get(t.id) || [];
                      const isTExpanded = expanded.has(`T:${tid}`);
                      return (
                        <div key={`T:${tid}`}>
                          <Row
                            level="theme"
                            code={t.code}
                            name={t.name}
                            desc={t.description}
                            expanded={isTExpanded}
                            onToggle={() => toggle(`T:${tid}`)}
                          />
                          {isTExpanded &&
                            sOfT.map((s) => (
                              <Row
                                key={`S:${s.id}`}
                                level="subtheme"
                                code={s.code}
                                name={s.name}
                                desc={s.description}
                                expanded={false}
                                onToggle={undefined}
                              />
                            ))}
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style jsx global>{frameworkCss}</style>
    </div>
  );
}

function sortByOrderThenCode<A extends { sort_order?: number | null; code?: string | null }>(a: A, b: A) {
  const ao = a.sort_order ?? 0;
  const bo = b.sort_order ?? 0;
  if (ao !== bo) return ao - bo;
  const ac = (a.code ?? '').localeCompare(b.code ?? undefined as any);
  return ac;
}

function Row(props: {
  level: 'pillar' | 'theme' | 'subtheme';
  code: string;
  name: string;
  desc?: string | null;
  expanded: boolean;
  onToggle?: () => void;
}) {
  const { level, code, name, desc, expanded, onToggle } = props;
  const tagClass =
    level === 'pillar' ? 'tag-blue' : level === 'theme' ? 'tag-green' : 'tag-gray';

  return (
    <div className={`fw-tr lvl-${level}`}>
      <div className="fw-td fw-col-name">
        <button
          className={`caret ${onToggle ? '' : 'invisible'}`}
          onClick={onToggle}
          aria-label="expand/collapse"
        >
          {expanded ? '▾' : '▸'}
        </button>
        <span className={`tag ${tagClass}`}>{level}</span>
        <span className="code">[{code}]</span>
        <span className="name">{name}</span>
      </div>
      <div className="fw-td fw-col-desc">
        {desc || <span className="muted">No description</span>}
      </div>
    </div>
  );
}

const frameworkCss = `
.fw-wrap { padding: 16px 20px; }
.fw-header { display:flex; align-items:center; gap:12px; margin-bottom:16px; }
.fw-back { color:#2563eb; text-decoration:none; }
.fw-refresh { padding:6px 10px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; }
.fw-note { padding:8px 0; color:#374151; }
.fw-error { padding:10px 12px; background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; border-radius:8px; }

.fw-table { border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; }
.fw-thead, .fw-tr { display:grid; grid-template-columns: 60% 40%; }
.fw-th { background:#f9fafb; font-weight:600; color:#111827; padding:10px 12px; border-bottom:1px solid #e5e7eb; }
.fw-td { padding:12px; border-bottom:1px solid #f3f4f6; }

.fw-tr.lvl-theme { padding-left:16px; }
.fw-tr.lvl-subtheme { padding-left:36px; }
.fw-col-name { display:flex; align-items:center; gap:8px; }
.caret { width:22px; height:22px; font-size:14px; display:inline-flex; align-items:center; justify-content:center; border:1px solid #e5e7eb; border-radius:6px; background:#fff; }
.caret.invisible { visibility:hidden; }
.tag { padding:2px 8px; border-radius:999px; font-size:12px; border:1px solid transparent; }
.tag-blue { background:#eff6ff; color:#1d4ed8; border-color:#bfdbfe; }
.tag-green { background:#ecfdf5; color:#047857; border-color:#a7f3d0; }
.tag-gray { background:#f3f4f6; color:#374151; border-color:#e5e7eb; }
.code { color:#6b7280; font-size:12px; }
.name { margin-left:4px; }
.muted { color:#9ca3af; }
`;
