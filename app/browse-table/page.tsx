// app/browse-table/page.tsx
'use client';
import { useEffect, useMemo, useState } from 'react';

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
  pillar_code: string; pillar_name: string; pillar_statement: string;
  theme_code: string; theme_name: string; theme_statement: string;
  subtheme_code: string; subtheme_name: string; subtheme_statement: string;
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

  // Index helpers
  const pById = useMemo(() => Object.fromEntries(pillars.map(x => [x.id, x])), [pillars]);
  const tById = useMemo(() => Object.fromEntries(themes.map(x => [x.id, x])), [themes]);
  const sById = useMemo(() => Object.fromEntries(subs.map(x => [x.id, x])), [subs]);

  const indsByStandard = useMemo(() => {
    const m = new Map<string, Indicator[]>();
    for (const ind of inds) {
      if (ind.standard_id) {
        m.set(ind.standard_id, [...(m.get(ind.standard_id) || []), ind]);
      }
    }
    return m;
  }, [inds]);

  // Build flat rows (one per Standard × Indicator; or one per Standard if no indicators)
  const rows: Row[] = useMemo(() => {
    const out: Row[] = [];
    const sort = sortBy('sort_order','code');

    const stdsSorted = [...stds].sort(sort);
    for (const std of stdsSorted) {
      const sub = sById[std.subtheme_id];
      if (!sub) continue;
      const theme = tById[sub.theme_id];
      const pillar = theme ? pById[theme.pillar_id] : undefined;

      const base = {
        pillar_code: pillar?.code || '', pillar_name: pillar?.name || '', pillar_statement: pillar?.statement || '',
        theme_code: theme?.code || '', theme_name: theme?.name || '', theme_statement: theme?.statement || '',
        subtheme_code: sub?.code || '', subtheme_name: sub?.name || '', subtheme_statement: sub?.statement || '',
        standard_code: std.code, standard_statement: std.statement, standard_notes: std.notes || '',
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

  // Filter + sort
  const qx = q.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!qx) return rows;
    return rows.filter(r =>
      Object.values(r).some(v => String(v).toLowerCase().includes(qx))
    );
  }, [rows, qx]);

  const [sortKey, setSortKey] = useState<keyof Row>('pillar_code');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a,b) => {
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

  async function copyToClipboard() {
    const header = Object.keys(sorted[0] || {});
    const lines = [header.join('\t'), ...sorted.map(r => header.map(h => (r as any)[h]).join('\t'))];
    await navigator.clipboard.writeText(lines.join('\n'));
    alert('Copied table to clipboard (tab-separated).');
  }

  return (
    <main style={{ padding: 24, maxWidth: '100%', margin: '0 auto' }}>
      <h1>Framework Table (read-only)</h1>
      <p style={{ opacity: 0.8, marginBottom: 8 }}>
        Flat view of Pillar → Theme → Sub-theme → Standard → Indicator. Use search, sort headers, and export tools.
      </p>

      <div style={{ display:'flex', gap:8, alignItems:'center', margin:'12px 0 16px', flexWrap:'wrap' }}>
        <input
          placeholder="Search everything…"
          value={q}
          onChange={e=>setQ(e.target.value)}
          style={{ flex:'1 1 420px', minWidth: 220, padding:'10px 12px', border:'1px solid #ddd', borderRadius:8 }}
        />
        <a href="/api/export">Download CSV</a>
        <button onClick={copyToClipboard}>Copy</button>
        <button onClick={() => window.print()}>Print</button>
      </div>

      {loading && <p>Loading…</p>}
      {err && <p style={{ color:'crimson' }}>{err}</p>}

      <div style={{ overflow: 'auto', border:'1px solid #eee', borderRadius:8 }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize: 14 }}>
          <thead>
            <TrHead>
              <Th onClick={()=>onHeaderClick('pillar_code')} label="Pillar Code" curKey={sortKey} curDir={sortDir} k="pillar_code" />
              <Th onClick={()=>onHeaderClick('pillar_name')} label="Pillar Name" curKey={sortKey} curDir={sortDir} k="pillar_name" />
              <Th onClick={()=>onHeaderClick('pillar_statement')} label="Pillar Statement" curKey={sortKey} curDir={sortDir} k="pillar_statement" />
              <Th onClick={()=>onHeaderClick('theme_code')} label="Theme Code" curKey={sortKey} curDir={sortDir} k="theme_code" />
              <Th onClick={()=>onHeaderClick('theme_name')} label="Theme Name" curKey={sortKey} curDir={sortDir} k="theme_name" />
              <Th onClick={()=>onHeaderClick('theme_statement')} label="Theme Statement" curKey={sortKey} curDir={sortDir} k="theme_statement" />
              <Th onClick={()=>onHeaderClick('subtheme_code')} label="Sub-theme Code" curKey={sortKey} curDir={sortDir} k="subtheme_code" />
              <Th onClick={()=>onHeaderClick('subtheme_name')} label="Sub-theme Name" curKey={sortKey} curDir={sortDir} k="subtheme_name" />
              <Th onClick={()=>onHeaderClick('subtheme_statement')} label="Sub-theme Statement" curKey={sortKey} curDir={sortDir} k="subtheme_statement" />
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
            {sorted.map((r, i) => (
              <tr key={i} style={{ borderTop:'1px solid #f2f2f2' }}>
                <td style={td}>{r.pillar_code}</td>
                <td style={td}>{r.pillar_name}</td>
                <td style={tdWrap}>{r.pillar_statement}</td>
                <td style={td}>{r.theme_code}</td>
                <td style={td}>{r.theme_name}</td>
                <td style={tdWrap}>{r.theme_statement}</td>
                <td style={td}>{r.subtheme_code}</td>
                <td style={td}>{r.subtheme_name}</td>
                <td style={tdWrap}>{r.subtheme_statement}</td>
                <td style={td}>{r.standard_code}</td>
                <td style={tdWrap}>{r.standard_statement}</td>
                <td style={tdWrap}>{r.standard_notes}</td>
                <td style={td}>{r.indicator_code}</td>
                <td style={td}>{r.indicator_name}</td>
                <td style={tdWrap}>{r.indicator_description}</td>
                <td style={td}>{r.indicator_is_default}</td>
              </tr>
            ))}
            {sorted.length === 0 && !loading && (
              <tr><td style={{ padding:12 }} colSpan={16}>No matching rows.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function TrHead({ children }: { children: React.ReactNode }) {
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

const td: React.CSSProperties = { padding:'8px', whiteSpace:'nowrap' };
const tdWrap: React.CSSProperties = { padding:'8px', whiteSpace:'normal', maxWidth: 420, lineHeight: 1.3 };

function sortBy(a: string, b: string) {
  return (x: any, y: any) => {
    const ax = x?.[a] ?? 999999, ay = y?.[a] ?? 999999;
    if (ax !== ay) return ax - ay;
    const bx = String(x?.[b] ?? ''), by = String(y?.[b] ?? '');
    return bx.localeCompare(by, undefined, { numeric: true });
  };
}
