// app/browse-table/page.tsx
'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

type Pillar = { id: string; code: string; name: string; description?: string|null; sort_order: number|null; };
type Theme = { id: string; pillar_id: string; code: string; name: string; description?: string|null; sort_order: number|null; };
type Subtheme = { id: string; theme_id: string; code: string; name: string; description?: string|null; sort_order: number|null; };
type Standard = { id: string; subtheme_id: string; code: string; description: string; notes?: string|null; sort_order: number|null; };
type Indicator = {
  id: string; code?: string|null; name: string; description?: string|null; weight?: number|null;
  pillar_id?: string|null; theme_id?: string|null; subtheme_id?: string|null; standard_id?: string|null;
  is_default: boolean; sort_order: number|null;
};

type Row = {
  pillar_code: string; pillar_name: string; p_so: number;
  theme_code: string; theme_name: string; t_so: number;
  subtheme_code: string; subtheme_name: string; s_so: number;
  standard_description: string; std_so: number;
  indicator_name: string; indicator_description: string; ind_so: number;
};

// 🎨 Softer complementary pastels
const COLORS = {
  pillar: 'rgb(234,224,220)',  // light beige (from 204,182,173)
  theme:  'rgb(220,220,230)',  // soft grey-lavender (from 180,179,185)
  sub:    'rgb(232,238,247)',  // light pastel blue (from 202,212,226)
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

  // filters (by code)
  const [fPillar, setFPillar] = useState<string>('');    // pillar_code
  const [fTheme, setFTheme] = useState<string>('');      // theme_code
  const [fSub, setFSub] = useState<string>('');          // subtheme_code

  // collapse state (pillars & themes collapsed by default)
  const [collapsedP, setCollapsedP] = useState<Record<string, boolean>>({});
  const [collapsedT, setCollapsedT] = useState<Record<string, boolean>>({});

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

  // id<->code maps
  const pillarById = useMemo(() => Object.fromEntries(pillars.map(x => [x.id, x])), [pillars]);
  const themeById  = useMemo(() => Object.fromEntries(themes.map(x => [x.id, x])), [themes]);
  const subById    = useMemo(() => Object.fromEntries(subs.map(x => [x.id, x])), [subs]);

  const pillarCodeById = useMemo(() => Object.fromEntries(pillars.map(x => [x.id, x.code])), [pillars]);
  const themeCodeById  = useMemo(() => Object.fromEntries(themes.map(x => [x.id, x.code])), [themes]);
  const subCodeById    = useMemo(() => Object.fromEntries(subs.map(x => [x.id, x.code])), [subs]);

  // default indicator lookups by CODE
  const defaultIndByPillarCode = useMemo(() => {
    const m = new Map<string, Indicator>();
    for (const ind of inds) {
      if (ind.is_default && ind.pillar_id) {
        const code = pillarCodeById[ind.pillar_id];
        if (code && !m.has(code)) m.set(code, ind);
      }
    }
    return m;
  }, [inds, pillarCodeById]);

  const defaultIndByThemeCode = useMemo(() => {
    const m = new Map<string, Indicator>();
    for (const ind of inds) {
      if (ind.is_default && ind.theme_id) {
        const code = themeCodeById[ind.theme_id];
        if (code && !m.has(code)) m.set(code, ind);
      }
    }
    return m;
  }, [inds, themeCodeById]);

  const defaultIndBySubCode = useMemo(() => {
    const m = new Map<string, Indicator>();
    for (const ind of inds) {
      if (ind.is_default && ind.subtheme_id) {
        const code = subCodeById[ind.subtheme_id];
        if (code && !m.has(code)) m.set(code, ind);
      }
    }
    return m;
  }, [inds, subCodeById]);

  // flat rows (standards + indicators)
  const baseRows: Row[] = useMemo(() => {
    const out: Row[] = [];
    const so = (n: number|null|undefined) => (n ?? 999999);

    const indsByStd = new Map<string, Indicator[]>();
    for (const ind of inds) {
      if (!ind.standard_id) continue;
      indsByStd.set(ind.standard_id, [...(indsByStd.get(ind.standard_id) || []), ind]);
    }

    const stdsSorted = [...stds].sort((a,b) => so(a.sort_order) - so(b.sort_order) || (a.code||'').localeCompare(b.code||''));
    for (const std of stdsSorted) {
      const sub = subById[std.subtheme_id];
      if (!sub) continue;
      const theme = themeById[sub.theme_id];
      const pillar = theme ? pillarById[theme.pillar_id] : undefined;

      const rowBase = {
        pillar_code: pillar?.code || '',
        pillar_name: pillar?.name || pillar?.code || '',
        p_so: so(pillar?.sort_order),
        theme_code: theme?.code || '',
        theme_name: theme?.name || theme?.code || '',
        t_so: so(theme?.sort_order),
        subtheme_code: sub?.code || '',
        subtheme_name: sub?.name || sub?.code || '',
        s_so: so(sub?.sort_order),
        standard_description: std.description,
        std_so: so(std.sort_order),
      };

      const theseInds = (indsByStd.get(std.id) || []).sort((a,b) => so(a.sort_order) - so(b.sort_order) || (a.code||'').localeCompare(b.code||''));
      if (theseInds.length === 0) {
        out.push({ ...rowBase, indicator_name: '', indicator_description: '', ind_so: 999999 });
      } else {
        for (const ind of theseInds) {
          out.push({ ...rowBase, indicator_name: ind.name, indicator_description: ind.description || '', ind_so: so(ind.sort_order) });
        }
      }
    }

    out.sort((A,B) =>
      (A.p_so - B.p_so) ||
      A.pillar_name.localeCompare(B.pillar_name, undefined, { numeric: true }) ||
      (A.t_so - B.t_so) ||
      A.theme_name.localeCompare(B.theme_name, undefined, { numeric: true }) ||
      (A.s_so - B.s_so) ||
      A.subtheme_name.localeCompare(B.subtheme_name, undefined, { numeric: true }) ||
      (A.std_so - B.std_so) ||
      (A.ind_so - B.ind_so)
    );

    return out;
  }, [stds, inds, pillarById, themeById, subById]);

  // Filters
  const pillarOptions = useMemo(() => {
    const seen = new Map<string,string>();
    for (const r of baseRows) if (r.pillar_code && !seen.has(r.pillar_code)) seen.set(r.pillar_code, r.pillar_name);
    return Array.from(seen.entries()).map(([code,name]) => ({ code, name }));
  }, [baseRows]);

  const themeOptions = useMemo(() => {
    const seen = new Map<string,string>();
    for (const r of baseRows) {
      if (fPillar && r.pillar_code !== fPillar) continue;
      if (r.theme_code && !seen.has(r.theme_code)) seen.set(r.theme_code, r.theme_name);
    }
    return Array.from(seen.entries()).map(([code,name]) => ({ code, name }));
  }, [baseRows, fPillar]);

  const subthemeOptions = useMemo(() => {
    const seen = new Map<string,string>();
    for (const r of baseRows) {
      if (fPillar && r.pillar_code !== fPillar) continue;
      if (fTheme && r.theme_code !== fTheme) continue;
      if (r.subtheme_code && !seen.has(r.subtheme_code)) seen.set(r.subtheme_code, r.subtheme_name);
    }
    return Array.from(seen.entries()).map(([code,name]) => ({ code, name }));
  }, [baseRows, fPillar, fTheme]);

  // Apply filters + search
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
          r.standard_description, r.indicator_name, r.indicator_description
        ].some(v => String(v || '').toLowerCase().includes(qx))
      );
    }
    return rows;
  }, [baseRows, fPillar, fTheme, fSub, qx]);

  // Build tree groups from filtered rows
  const tree = useMemo(() => buildTree(filtered), [filtered]);

  // descriptions by CODE
  const pillarDescByCode = useMemo(() => new Map(pillars.map(p => [p.code, p.description ?? ''])), [pillars]);
  const themeDescByCode  = useMemo(() => new Map(themes.map(t => [t.code, t.description ?? ''])), [themes]);
  const subDescByCode    = useMemo(() => new Map(subs.map(s => [s.code, s.description ?? ''])), [subs]);

  // default-collapse pillars & themes whenever the tree changes
  useEffect(() => {
    const newP: Record<string, boolean> = {};
    const newT: Record<string, boolean> = {};
    for (const p of tree) {
      if (p.code) newP[p.code] = true;
      for (const t of p.themes) if (t.code) newT[t.code] = true;
    }
    setCollapsedP(newP);
    setCollapsedT(newT);
  }, [tree.length]);

  const toggleP = (code: string) => setCollapsedP(m => ({ ...m, [code]: !m[code] }));
  const toggleT = (code: string) => setCollapsedT(m => ({ ...m, [code]: !m[code] }));
  const expandAll = () => { setCollapsedP({}); setCollapsedT({}); };
  const collapseAll = () => {
    const p: Record<string, boolean> = {};
    const t: Record<string, boolean> = {};
    for (const P of tree) { if (P.code) p[P.code] = true; for (const T of P.themes) if (T.code) t[T.code] = true; }
    setCollapsedP(p); setCollapsedT(t);
  };

  return (
    <main style={{ padding: 24, maxWidth: '100%', margin: '0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom: 8 }}>
        <Link href="/" style={{ textDecoration:'none' }}>← Back to Home</Link>
      </div>

      <h1>Framework Table (read-only)</h1>
      <p style={{ opacity: 0.8, marginBottom: 8 }}>
        Color-coded by level. Descriptions & default indicators shown on each level. Ordered by framework sort order. Pillars & Themes start collapsed.
      </p>

      <div style={{ display:'flex', gap:8, alignItems:'center', margin:'12px 0', flexWrap:'wrap' }}>
        <input
          placeholder="Search (pillar, theme, sub-theme, standard, indicator)…"
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
      </div>

      {loading && <p>Loading…</p>}
      {err && <p style={{ color:'crimson' }}>{err}</p>}

      <div style={{ overflow: 'auto', border:'1px solid #eee', borderRadius:8 }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background:'#fafafa', borderBottom:'1px solid #eee' }}>
              <Th label="Pillar" />
              <Th label="Theme" />
              <Th label="Sub-theme" />
              <Th label="Standard Description" />
              <Th label="Indicator Name" />
              <Th label="Indicator Description" />
            </tr>
          </thead>
          <tbody>
            {renderInlineRows(
              tree,
              collapsedP, collapsedT,
              { toggleP, toggleT },
              {
                pillarDescByCode, themeDescByCode, subDescByCode,
                defaultIndByPillarCode, defaultIndByThemeCode, defaultIndBySubCode
              }
            )}
            {tree.length === 0 && !loading && (
              <tr><td style={{ padding:12 }} colSpan={6}>No matching rows.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

/* ---------- render inline rows with level colors ---------- */
function renderInlineRows(
  tree: ReturnType<typeof buildTree>,
  collapsedP: Record<string, boolean>,
  collapsedT: Record<string, boolean>,
  toggles: { toggleP: (c:string)=>void, toggleT: (c:string)=>void },
  lookups: {
    pillarDescByCode: Map<string,string>,
    themeDescByCode: Map<string,string>,
    subDescByCode: Map<string,string>,
    defaultIndByPillarCode: Map<string, Indicator>,
    defaultIndByThemeCode: Map<string, Indicator>,
    defaultIndBySubCode: Map<string, Indicator>,
  }
) {
  const out: ReactNode[] = [];

  for (const P of tree) {
    const pCollapsed = !!collapsedP[P.code];

    const pDesc = lookups.pillarDescByCode.get(P.code) || '';
    const pDef = lookups.defaultIndByPillarCode.get(P.code);

    // Pillar row → colored (soft)
    out.push(
      <tr key={`p-${P.code}`} style={{ background: COLORS.pillar, borderTop:'1px solid #e6e6e6' }}>
        <td style={td}>
          <button onClick={()=>toggles.toggleP(P.code)} style={btnLink}>{pCollapsed ? '▶' : '▼'} {P.pillar_name}</button>
        </td>
        <td style={td}></td>
        <td style={td}></td>
        <td style={tdWrap}>{pDesc}</td>
        <td style={td}>{pDef?.name || ''}</td>
        <td style={tdWrap}>{pDef?.description || ''}</td>
      </tr>
    );
    if (pCollapsed) continue;

    for (const T of P.themes) {
      const tCollapsed = !!collapsedT[T.code];

      const tDesc = lookups.themeDescByCode.get(T.code) || '';
      const tDef = lookups.defaultIndByThemeCode.get(T.code);

      // Theme row → colored (soft)
      out.push(
        <tr key={`t-${P.code}-${T.code}`} style={{ background: COLORS.theme }}>
          <td style={td}></td>
          <td style={td}>
            <button onClick={()=>toggles.toggleT(T.code)} style={btnLink}>{tCollapsed ? '▶' : '▼'} {T.theme_name}</button>
          </td>
          <td style={td}></td>
          <td style={tdWrap}>{tDesc}</td>
          <td style={td}>{tDef?.name || ''}</td>
          <td style={tdWrap}>{tDef?.description || ''}</td>
        </tr>
      );
      if (tCollapsed) continue;

      for (const S of T.subthemes) {
        const sDesc = lookups.subDescByCode.get(S.code) || '';
        const sDef = lookups.defaultIndBySubCode.get(S.code);

        // Sub-theme summary row → colored (soft)
        out.push(
          <tr key={`s-${P.code}-${T.code}-${S.code}-summary`} style={{ background: COLORS.sub }}>
            <td style={td}></td>
            <td style={td}></td>
            <td style={td}>{S.subtheme_name}</td>
            <td style={tdWrap}>{sDesc}</td>
            <td style={td}>{sDef?.name || ''}</td>
            <td style={tdWrap}>{sDef?.description || ''}</td>
          </tr>
        );

        // Standards rows (keep white)
        for (const r of S.rows) {
          out.push(
            <tr key={`r-${P.code}-${T.code}-${S.code}-${r.standard_description}-${r.indicator_name}`} style={{ borderTop:'1px solid #f2f2f2' }}>
              <td style={td}></td>
              <td style={td}></td>
              <td style={td}></td>
              <td style={tdWrap}>{r.standard_description}</td>
              <td style={td}>{r.indicator_name}</td>
              <td style={tdWrap}>{r.indicator_description}</td>
            </tr>
          );
        }
      }
    }
  }

  return out;
}

/* ---------- build a stable tree from flat rows ---------- */
function buildTree(rows: Row[]) {
  type SubNode = { code: string; subtheme_name: string; rows: Row[] };
  type ThemeNode = { code: string; theme_name: string; subthemes: SubNode[] };
  type PillarNode = { code: string; pillar_name: string; themes: ThemeNode[] };

  const pMap = new Map<string, PillarNode>();
  const tMap = new Map<string, ThemeNode>();

  for (const r of rows) {
    let P = pMap.get(r.pillar_code);
    if (!P) {
      P = { code: r.pillar_code, pillar_name: r.pillar_name, themes: [] };
      pMap.set(r.pillar_code, P);
    }

    const tKey = r.pillar_code + '|' + r.theme_code;
    let T = tMap.get(tKey);
    if (!T) {
      T = { code: r.theme_code, theme_name: r.theme_name, subthemes: [] };
      tMap.set(tKey, T);
      P.themes.push(T);
    }

    let S = T.subthemes.find(x => x.code === r.subtheme_code);
    if (!S) {
      S = { code: r.subtheme_code, subtheme_name: r.subtheme_name, rows: [] };
      T.subthemes.push(S);
    }

    S.rows.push(r);
  }

  return Array.from(pMap.values());
}

/* ---------- small UI ---------- */
function Th({ label }: { label: string }) {
  return (
    <th
      style={{
        textAlign:'left', padding:'10px 8px',
        position:'sticky', top:0, background:'#fafafa', zIndex:1,
        whiteSpace:'nowrap'
      }}
    >
      {label}
    </th>
  );
}

const td: React.CSSProperties = { padding:'8px', whiteSpace:'nowrap', verticalAlign:'top' };
const tdWrap: React.CSSProperties = { padding:'8px', whiteSpace:'normal', maxWidth: 520, lineHeight: 1.3 };
const btnLink: React.CSSProperties = { background:'none', border:'none', padding:0, margin:0, cursor:'pointer', font: 'inherit' };
