// app/browse-table/page.tsx
'use client';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

type Pillar = { id: string; code: string; name: string; statement?: string|null; description?: string|null; sort_order: number|null; };
type Theme = { id: string; pillar_id: string; code: string; name: string; statement?: string|null; description?: string|null; sort_order: number|null; };
type Subtheme = { id: string; theme_id: string; code: string; name: string; statement?: string|null; description?: string|null; sort_order: number|null; };
type Standard = { id: string; subtheme_id: string; code: string; statement: string; notes?: string|null; sort_order: number|null; };
type Indicator = {
  id: string; code?: string|null; name: string; description?: string|null; weight?: number|null;
  pillar_id?: string|null; theme_id?: string|null; subtheme_id?: string|null; standard_id?: string|null;
  is_default: boolean; sort_order: number|null;
};

type Row = {
  // grouping keys (kept internal)
  pillar_code: string; theme_code: string; subtheme_code: string;
  // display names
  pillar_name: string; theme_name: string; subtheme_name: string;
  // standard/indicator
  standard_code: string; standard_statement: string; standard_notes: string;
  indicator_code: string; indicator_name: string; indicator_description: string; indicator_is_default: string;
};

export default function BrowseTablePage() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [subs, setSubs] = useState<Subtheme[]>([]);
  const [stds, setStds] = useState<Standard[]>([]);
  const [inds, setInds] = useState<Indicator[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string|null>(null);

  // filters (values are codes; labels show names)
  const [fPillar, setFPillar] = useState<string>('');    // pillar_code
  const [fTheme, setFTheme] = useState<string>('');      // theme_code
  const [fSub, setFSub] = useState<string>('');          // subtheme_code

  // collapses (store by code)
  const [collapsedP, setCollapsedP] = useState<Record<string, boolean>>({});
  const [collapsedT, setCollapsedT] = useState<Record<string, boolean>>({});
  const [collapsedS, setCollapsedS] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      setLoading(true); setErr(null);
      const [pR, tR, sR, dR, iR] = await Promise.all([
        fetch('/api/pillars', { cache: 'no-store' }),
        fetch('/api/themes', { cache: 'no-store' }),
        fetch('/api/subthemes', { cache: 'no-store' }),
        fetch('/api/standards', { cache: 'no-store' }),
        fetch('/api/indicators', { cache: 'no-store' }),
      ]);
      const [p, t, s, d, i] = await Promise.all([pR.json(), tR.json(), sR.json(), dR.json(), iR.json()]);
      if (!pR.ok) setErr(p?.error || 'Failed to load pillars');
      if (!tR.ok) setErr(t?.error || 'Failed to load themes');
      if (!sR.ok) setErr(s?.error || 'Failed to load sub-themes');
      if (!dR.ok) setErr(d?.error || 'Failed to load standards');
      if (!iR.ok) setErr(i?.error || 'Failed to load indicators');
      if (pR.ok) setPillars(p); if (tR.ok) setThemes(t); if (sR.ok) setSubs(s); if (dR.ok) setStds(d); if (iR.ok) setInds(i);
      setLoading(false);
    })();
  }, []);

  // lookups
  const pById = useMemo(() => Object.fromEntries(pillars.map(x => [x.id, x])), [pillars]);
  const tById = useMemo(() => Object.fromEntries(themes.map(x => [x.id, x])), [themes]);
  const sById = useMemo(() => Object.fromEntries(subs.map(x => [x.id, x])), [subs]);

  // name maps for headers and filters
  const pillarNameByCode = useMemo(() => {
    const m = new Map<string,string>();
    for (const p of pillars) m.set(p.code, p.name || p.code);
    return m;
  }, [pillars]);
  const themeNameByCode = useMemo(() => {
    const m = new Map<string,string>();
    for (const t of themes) m.set(t.code, t.name || t.code);
    return m;
  }, [themes]);
  const subthemeNameByCode = useMemo(() => {
    const m = new Map<string,string>();
    for (const s of subs) m.set(s.code, s.name || s.code);
    return m;
  }, [subs]);

  // group indicators by standard
  const indsByStandard = useMemo(() => {
    const m = new Map<string, Indicator[]>();
    for (const ind of inds) {
      if (ind.standard_id) {
        m.set(ind.standard_id, [...(m.get(ind.standard_id) || []), ind]);
      }
    }
    return m;
  }, [inds]);

  // flat rows (codes kept internal, names used for display)
  const baseRows: Row[] = useMemo(() => {
    const out: Row[] = [];
    const sort = sortBy('sort_order','code');
    const stdsSorted = [...stds].sort(sort);

    for (const std of stdsSorted) {
      const sub = sById[std.subtheme_id];
      if (!sub) continue;
      const theme = tById[sub.theme_id];
      const pillar = theme ? pById[theme.pillar_id] : undefined;

      const base = {
        pillar_code: pillar?.code || '',
        theme_code: theme?.code || '',
        subtheme_code: sub?.code || '',
        pillar_name: pillar?.name || pillar?.code || '',
        theme_name: theme?.name || theme?.code || '',
        subtheme_name: sub?.name || sub?.code || '',
        standard_code: std.code,
        standard_statement: std.statement,
        standard_notes: std.notes || '',
      };

      const stdInds = (indsByStandard.get(std.id) || []).sort(sort);
      if (stdInds.length === 0) {
        out.push({ ...base, indicator_code: '', indicator_name: '', indicator_description: '', indicator_is_default: '' });
      } else {
        for (const ind of stdInds) {
          out.push({
            ...base,
            indicator_code: ind.code || '',
            indicator_name: ind.name,
            indicator_description: ind.description || '',
            indicator_is_default: ind.is_default ? 'yes' : '',
          });
        }
      }
    }
    return out;
  }, [stds, sById, tById, pById, indsByStandard]);

  // filter options (codes as values, names as labels)
  const pillarOptions = useMemo(() => {
    const set = new Set(baseRows.map(r => r.pillar_code).filter(Boolean));
    return Array.from(set).sort().map(code => ({ code, name: pillarNameByCode.get(code) || code }));
  }, [baseRows, pillarNameByCode]);
  const themeOptions = useMemo(() => {
    let rows = baseRows;
    if (fPillar) rows = rows.filter(r => r.pillar_code === fPillar);
    const set = new Set(rows.map(r => r.theme_code).filter(Boolean));
    return Array.from(set).sort().map(code => ({ code, name: themeNameByCode.get(code) || code }));
  }, [baseRows, fPillar, themeNameByCode]);
  const subthemeOptions = useMemo(() => {
    let rows = baseRows;
    if (fPillar) rows = rows.filter(r => r.pillar_code === fPillar);
    if (fTheme) rows = rows.filter(r => r.theme_code === fTheme);
    const set = new Set(rows.map(r => r.subtheme_code).filter(Boolean));
    return Array.from(set).sort().map(code => ({ code, name: subthemeNameByCode.get(code) || code }));
  }, [baseRows, fPillar, fTheme, subthemeNameByCode]);

  // apply text + dropdown filters
  const qx = q.trim().toLowerCase();
  const filtered = useMemo(() => {
    let rows = baseRows;
    if (fPillar) rows = rows.filter(r => r.pillar_code === fPillar);
    if (fTheme) rows = rows.filter(r => r.theme_code === fTheme);
    if (fSub) rows = rows.filter(r => r.subtheme_code === fSub);

    if (qx) {
      rows = rows.filter(r =>
        [
          r.pillar_name, r.theme_name, r.subtheme_name,
          r.standard_code, r.standard_statement, r.standard_notes,
          r.indicator_code, r.indicator_name, r.indicator_description
        ].some(v => String(v || '').toLowerCase().includes(qx))
      );
    }
    return rows;
  }, [baseRows, fPillar, fTheme, fSub, qx]);

  // sort (default by pillar/theme/subtheme then standard code)
  const [sortKey, setSortKey] = useState<keyof Row>('standard_code');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a,b) => {
      const chainA = [a.pillar_name || a.pillar_code, a.theme_name || a.theme_code, a.subtheme_name || a.subtheme_code];
      const chainB = [b.pillar_name || b.pillar_code, b.theme_name || b.theme_code, b.subtheme_name || b.subtheme_code];
      for (let i=0;i<3;i++) {
        const cmp = (chainA[i] || '').localeCompare(chainB[i] || '', undefined, { numeric: true, sensitivity: 'base' });
        if (cmp !== 0) return cmp;
      }
      const av = String(a[sortKey] ?? '');
      const bv = String(b[sortKey] ?? '');
      const cmp = av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' });
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  function onHeaderClick(k: keyof Row) {
    if (k === sortKey) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(k); setSortDir('asc'); }
  }

  // level-specific bulk collapse helpers
  function collapsePillarsOnly() {
    const p: Record<string, boolean> = {};
    for (const r of sorted) if (r.pillar_code) p[r.pillar_code] = true;
    setCollapsedP(p);
  }
  function expandPillarsOnly() { setCollapsedP({}); }
  function expandAll() { setCollapsedP({}); setCollapsedT({}); setCollapsedS({}); }
  function collapseAll() {
    const p: Record<string, boolean> = {};
    const t: Record<string, boolean> = {};
    const s: Record<string, boolean> = {};
    for (const r of sorted) {
      if (r.pillar_code) p[r.pillar_code] = true;
      if (r.theme_code) t[r.theme_code] = true;
      if (r.subtheme_code) s[r.subtheme_code] = true;
    }
    setCollapsedP(p); setCollapsedT(t); setCollapsedS(s);
  }

  return (
    <main style={{ padding: 24, maxWidth: '100%', margin: '0 auto' }}>
      <h1>Framework Table (read-only)</h1>
      <p style={{ opacity: 0.8, marginBottom: 8 }}>
        Collapsible groups and filters. Pillar/Theme/Sub-theme names are shown; codes are hidden.
      </p>

      <div style={{ display:'flex', gap:8, alignItems:'center', margin:'12px 0 12px', flexWrap:'wrap' }}>
        <input
          placeholder="Search everything…"
          value={q}
          onChange={e=>setQ(e.target.value)}
          style={{ flex:'1 1 320px', minWidth: 220, padding:'10px 12px', border:'1px solid #ddd', borderRadius:8 }}
        />
        <select value={fPillar} onChange={(e)=>{ setFPillar(e.target.value); setFTheme(''); setFSub(''); }} aria-label="Filter by Pillar">
          <option value="">All Pillars</option>
          {pillarOptions.map(o => <option key={o.code} value={o.code}>{o.name}</option>)}
        </select>
        <select value={fTheme} onChange={(e)=>{ setFTheme(e.target.value); setFSub(''); }} aria-label="Filter by Theme" disabled={pillarOptions.length===0 && themeOptions.length===0}>
          <option value="">All Themes</option>
          {themeOptions.map(o => <option key={o.code} value={o.code}>{o.name}</option>)}
        </select>
        <select value={fSub} onChange={(e)=>setFSub(e.target.value)} aria-label="Filter by Sub-theme" disabled={subthemeOptions.length===0}>
          <option value="">All Sub-themes</option>
          {subthemeOptions.map(o => <option key={o.code} value={o.code}>{o.name}</option>)}
        </select>
        <a href="/api/export">Download CSV</a>
        <button onClick={expandAll}>Expand all</button>
        <button onClick={collapseAll}>Collapse all</button>
        <button onClick={expandPillarsOnly} title="Show just the three pillar rows (no details)">Expand pillars</button>
        <button onClick={collapsePillarsOnly} title="Collapse all pillars to a condensed 3-row view">Collapse pillars</button>
      </div>

      {loading && <p>Loading…</p>}
      {err && <p style={{ color:'crimson' }}>{err}</p>}

      <div style={{ overflow: 'auto', border:'1px solid #eee', borderRadius:8 }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize: 14 }}>
          <thead>
            <TrHead>
              <Th onClick={()=>onHeaderClick('standard_code')} label="Standard Code" curKey={sortKey} curDir={sortDir} k="standard_code" />
              <Th onClick={()=>onHeaderClick('standard_statement')} label="Standard Statement" curKey={sortKey} curDir={sortDir} k="standard_statement" />
              <Th onClick={()=>onHeaderClick('standard_notes')} label="Standard Notes" curKey={sortKey} curDir={sortDir} k="standard_notes" />
              <Th onClick={()=>onHeaderClick('indicator_code')} label="Indicator Code" curKey={sortKey} curDir={sortDir} k="indicator_code" />
              <Th onClick={()=>onHeaderClick('indicator_name')} label="Indicator Name" curKey={sortKey} curDir={sortDir} k="indicator_name" />
              <Th onClick={()=>onHeaderClick('indicator_description')} label="Indicator Description" curKey={sortKey} curDir={sortDir} k="indicator_description" />
              <Th onClick={()=>onHeaderClick('indicator_is_default')} label="Default?" curKey={sortKey} curDir={sortDir} k="indicator_is_default" />
            </TrHead>
          </thead>
          <tbody>
            {renderGroupedRows(
              sorted,
              { collapsedP, collapsedT, collapsedS },
              {
                toggleP: (code) => setCollapsedP(m => ({ ...m, [code]: !m[code] })),
                toggleT: (code) => setCollapsedT(m => ({ ...m, [code]: !m[code] })),
                toggleS: (code) => setCollapsedS(m => ({ ...m, [code]: !m[code] })),
              },
              { pillarNameByCode, themeNameByCode, subthemeNameByCode }
            )}
            {sorted.length === 0 && !loading && (
              <tr><td style={{ padding:12 }} colSpan={7}>No matching rows.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

/* ---------- grouped rows renderer (tree-based, no index skipping) ---------- */
function renderGroupedRows(
  rows: Row[],
  collapsed: { collapsedP: Record<string, boolean>, collapsedT: Record<string, boolean>, collapsedS: Record<string, boolean> },
  toggles: { toggleP: (c:string)=>void, toggleT: (c:string)=>void, toggleS: (c:string)=>void },
  names: { pillarNameByCode: Map<string,string>, themeNameByCode: Map<string,string>, subthemeNameByCode: Map<string,string> }
) {
  const tree = buildTree(rows);
  const out: ReactNode[] = [];

  for (const p of tree) {
    const pLabel = names.pillarNameByCode.get(p.code) || p.rows[0]?.pillar_name || p.code || '—';
    const pCollapsed = !!collapsed.collapsedP[p.code];
    out.push(
      <tr key={`p-${p.code}`} style={{ background:'#f8fafc', borderTop:'1px solid #e6e6e6' }}>
        <td colSpan={7} style={{ padding:'8px 10px', fontWeight:600 }}>
          <button onClick={()=>toggles.toggleP(p.code)} style={btnLink}>
            {pCollapsed ? '▶' : '▼'} Pillar — {pLabel}
          </button>
        </td>
      </tr>
    );
    if (pCollapsed) continue;

    for (const t of p.themes) {
      const tLabel = names.themeNameByCode.get(t.code) || t.rows[0]?.theme_name || t.code || '—';
      const tCollapsed = !!collapsed.collapsedT[t.code];
      out.push(
        <tr key={`t-${p.code}-${t.code}`} style={{ background:'#fbfcff' }}>
          <td colSpan={7} style={{ padding:'6px 10px 6px 24px', fontWeight:600 }}>
            <button onClick={()=>toggles.toggleT(t.code)} style={btnLink}>
              {tCollapsed ? '▶' : '▼'} Theme — {tLabel}
            </button>
          </td>
        </tr>
      );
      if (tCollapsed) continue;

      for (const s of t.subthemes) {
        const sLabel = names.subthemeNameByCode.get(s.code) || s.rows[0]?.subtheme_name || s.code || '—';
        const sCollapsed = !!collapsed.collapsedS[s.code];
        out.push(
          <tr key={`s-${p.code}-${t.code}-${s.code}`} style={{ background:'#ffffff' }}>
            <td colSpan={7} style={{ padding:'6px 10px 6px 48px', fontWeight:600 }}>
              <button onClick={()=>toggles.toggleS(s.code)} style={btnLink}>
                {sCollapsed ? '▶' : '▼'} Sub-theme — {sLabel}
              </button>
            </td>
          </tr>
        );
        if (sCollapsed) continue;

        for (const r of s.rows) {
          out.push(
            <tr key={`r-${p.code}-${t.code}-${s.code}-${r.standard_code}-${r.indicator_code}`} style={{ borderTop:'1px solid #f2f2f2' }}>
              <td style={td}>{r.standard_code}</td>
              <td style={tdWrap}>{r.standard_statement}</td>
              <td style={tdWrap}>{r.standard_notes}</td>
              <td style={td}>{r.indicator_code}</td>
              <td style={td}>{r.indicator_name}</td>
              <td style={tdWrap}>{r.indicator_description}</td>
              <td style={td}>{r.indicator_is_default}</td>
            </tr>
          );
        }
      }
    }
  }

  return out;
}

/* ---------- build a stable tree from sorted flat rows ---------- */
function buildTree(rows: Row[]) {
  type SubNode = { code: string; rows: Row[] };
  type ThemeNode = { code: string; subthemes: SubNode[]; rows: Row[] };
  type PillarNode = { code: string; themes: ThemeNode[]; rows: Row[] };

  const pillars: PillarNode[] = [];
  const pMap = new Map<string, PillarNode>();

  for (const r of rows) {
    // Pillar
    let p = pMap.get(r.pillar_code);
    if (!p) {
      p = { code: r.pillar_code, themes: [], rows: [] };
      pMap.set(r.pillar_code, p);
      pillars.push(p);
    }
    p.rows.push(r);

    // Theme
    let t = p.themes.find(x => x.code === r.theme_code);
    if (!t) {
      t = { code: r.theme_code, subthemes: [], rows: [] };
      p.themes.push(t);
    }
    t.rows.push(r);

    // Sub-theme
    let s = t.subthemes.find(x => x.code === r.subtheme_code);
    if (!s) {
      s = { code: r.subtheme_code, rows: [] };
      t.subthemes.push(s);
    }
    s.rows.push(r);
  }

  return pillars;
}

/* ---------- small UI helpers ---------- */
function TrHead({ children }: { children: ReactNode }) {
  return <tr style={{ background:'#fafafa', borderBottom:'1px solid #eee' }}>{children}</tr>;
}

function Th({ onClick, label, curKey, curDir, k }: {
  onClick: ()=>void; label: string; curKey: keyof Row; curDir: 'asc'|'desc'; k: keyof Row;
}) {
  const active = curKey === k;
  return (
    <th
      onClick={onClick}
      style={{
        textAlign:'left', padding:'10px 8px', cursor:'pointer',
        position:'sticky', top:0, background:'#fafafa', zIndex:1,
        whiteSpace:'nowrap'
      }}
      title="Click to sort"
    >
      {label} {active ? (curDir === 'asc' ? '▲' : '▼') : ''}
    </th>
  );
}

const td: React.CSSProperties = { padding:'8px', whiteSpace:'nowrap', verticalAlign:'top' };
const tdWrap: React.CSSProperties = { padding:'8px', whiteSpace:'normal', maxWidth: 420, lineHeight: 1.3 };
const btnLink: React.CSSProperties = { background:'none', border:'none', padding:0, margin:0, cursor:'pointer', font: 'inherit' };

/* ---------- sort helper ---------- */
function sortBy(a: string, b: string) {
  return (x: any, y: any) => {
    const ax = x?.[a] ?? 999999, ay = y?.[a] ?? 999999;
    if (ax !== ay) return ax - ay;
    const bx = String(x?.[b] ?? ''), by = String(y?.[b] ?? '');
    return bx.localeCompare(by, undefined, { numeric: true });
  };
}
