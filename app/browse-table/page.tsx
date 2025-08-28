// app/browse-table/page.tsx
'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState, type ReactNode } from 'react';

type Pillar = { id: string; code: string; name: string; description?: string|null; sort_order: number|null; };
type Theme = { id: string; pillar_id: string; code: string; name: string; description?: string|null; sort_order: number|null; };
type Subtheme = { id: string; theme_id: string; code: string; name: string; description?: string|null; sort_order: number|null; };
type Standard = { id: string; subtheme_id: string; code: string|null; description: string; notes?: string|null; sort_order: number|null; };
type Indicator = {
  id: string; code?: string|null; name: string; description?: string|null; weight?: number|null;
  pillar_id?: string|null; theme_id?: string|null; subtheme_id?: string|null; standard_id?: string|null;
  is_default: boolean; sort_order: number|null;
};

type Row = {
  pillar_code: string; pillar_name: string; pillar_id: string; p_so: number;
  theme_code: string; theme_name: string; theme_id: string; t_so: number;
  subtheme_code: string; subtheme_name: string; subtheme_id: string; s_so: number;
  standard_id?: string; standard_description: string; std_so: number;
  indicator_name: string; indicator_description: string; ind_so: number;
};

// 🎨 Softer complementary pastels
const COLORS = {
  pillar: 'rgb(234,224,220)',  // light beige
  theme:  'rgb(220,220,230)',  // soft grey-lavender
  sub:    'rgb(232,238,247)',  // light pastel blue
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

  // edit mode state
  const [editMode, setEditMode] = useState(false);

  // inline editing trackers
  const [editing, setEditing] = useState<{ kind:'pillar'|'theme'|'sub'|'std'; id:string }|null>(null);
  const [form, setForm] = useState<Record<string, string>>({}); // generic form state

  // "add child" trackers
  const [addingUnder, setAddingUnder] = useState<{ kind:'pillar'|'theme'|'sub'; id:string }|null>(null);
  const [addForm, setAddForm] = useState<Record<string, string>>({});

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

  // id maps
  const pillarById = useMemo(() => Object.fromEntries(pillars.map(x => [x.id, x])), [pillars]);
  const themeById  = useMemo(() => Object.fromEntries(themes.map(x => [x.id, x])), [themes]);
  const subById    = useMemo(() => Object.fromEntries(subs.map(x => [x.id, x])), [subs]);

  const so = (n: number|null|undefined) => (n ?? 999999);

  // default indicators
  const defIndByPillarId = useMemo(() => {
    const m = new Map<string, Indicator>();
    for (const ind of inds) if (ind.is_default && ind.pillar_id && !m.has(ind.pillar_id)) m.set(ind.pillar_id, ind);
    return m;
  }, [inds]);
  const defIndByThemeId = useMemo(() => {
    const m = new Map<string, Indicator>();
    for (const ind of inds) if (ind.is_default && ind.theme_id && !m.has(ind.theme_id)) m.set(ind.theme_id, ind);
    return m;
  }, [inds]);
  const defIndBySubId = useMemo(() => {
    const m = new Map<string, Indicator>();
    for (const ind of inds) if (ind.is_default && ind.subtheme_id && !m.has(ind.subtheme_id)) m.set(ind.subtheme_id, ind);
    return m;
  }, [inds]);

  // flat rows (standards + indicators) with ids included
  const baseRows: Row[] = useMemo(() => {
    const out: Row[] = [];
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
        pillar_id: pillar?.id || '',
        pillar_code: pillar?.code || '',
        pillar_name: pillar?.name || pillar?.code || '',
        p_so: so(pillar?.sort_order),

        theme_id: theme?.id || '',
        theme_code: theme?.code || '',
        theme_name: theme?.name || theme?.code || '',
        t_so: so(theme?.sort_order),

        subtheme_id: sub?.id || '',
        subtheme_code: sub?.code || '',
        subtheme_name: sub?.name || sub?.code || '',
        s_so: so(sub?.sort_order),

        standard_id: std.id,
        standard_description: std.description,
        std_so: so(std.sort_order),

        indicator_name: '',
        indicator_description: '',
        ind_so: 999999,
      };

      const theseInds = (indsByStd.get(std.id) || []).sort((a,b) => so(a.sort_order) - so(b.sort_order) || (a.code||'').localeCompare(b.code||''));
      if (theseInds.length === 0) {
        out.push(rowBase);
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
        [r.pillar_name, r.theme_name, r.subtheme_name, r.standard_description, r.indicator_name, r.indicator_description]
          .some(v => String(v || '').toLowerCase().includes(qx))
      );
    }
    return rows;
  }, [baseRows, fPillar, fTheme, fSub, qx]);

  // Build tree groups from filtered rows
  const tree = useMemo(() => buildTree(filtered), [filtered]);

  // descriptions by id
  const pillarDescById = useMemo(() => new Map(pillars.map(p => [p.id, p.description ?? ''])), [pillars]);
  const themeDescById  = useMemo(() => new Map(themes.map(t => [t.id, t.description ?? ''])), [themes]);
  const subDescById    = useMemo(() => new Map(subs.map(s => [s.id, s.description ?? ''])), [subs]);

  // default-collapse pillars & themes whenever the tree changes
  useEffect(() => {
    const newP: Record<string, boolean> = {};
    const newT: Record<string, boolean> = {};
    for (const p of tree) {
      if (p.pillar_id) newP[p.pillar_id] = true;
      for (const t of p.themes) if (t.theme_id) newT[t.theme_id] = true;
    }
    setCollapsedP(newP);
    setCollapsedT(newT);
  }, [tree.length]);

  // actions: load
  async function reload() {
    try {
      setLoading(true);
      const [pR, tR, sR, dR, iR] = await Promise.all([
        fetch('/api/pillars', { cache: 'no-store' }),
        fetch('/api/themes', { cache: 'no-store' }),
        fetch('/api/subthemes', { cache: 'no-store' }),
        fetch('/api/standards', { cache: 'no-store' }),
        fetch('/api/indicators', { cache: 'no-store' }),
      ]);
      const [p, t, s, d, i] = await Promise.all([pR.json(), tR.json(), sR.json(), dR.json(), iR.json()]);
      if (pR.ok) setPillars(p);
      if (tR.ok) setThemes(t);
      if (sR.ok) setSubs(s);
      if (dR.ok) setStds(d);
      if (iR.ok) setInds(i);
    } finally {
      setLoading(false);
      setEditing(null);
      setAddingUnder(null);
      setForm({});
      setAddForm({});
    }
  }

  function beginEdit(kind:'pillar'|'theme'|'sub'|'std', id:string, seed:Record<string, string>) {
    setEditing({ kind, id });
    setForm(seed);
  }

  async function saveEdit() {
    if (!editing) return;
    const { kind, id } = editing;
    const body: any = {};
    if (kind === 'pillar' || kind === 'theme' || kind === 'sub') {
      body.code = form.code || '';
      body.name = form.name || '';
      body.description = form.description || '';
      body.sort_order = form.sort_order ? Number(form.sort_order) : null;
    } else if (kind === 'std') {
      body.code = form.code || null;
      body.description = form.description || '';
      body.notes = form.notes || null;
      body.sort_order = form.sort_order ? Number(form.sort_order) : null;
    }
    const url =
      kind === 'pillar' ? `/api/pillars/${id}` :
      kind === 'theme'  ? `/api/themes/${id}` :
      kind === 'sub'    ? `/api/subthemes/${id}` :
                          `/api/standards/${id}`;
    const res = await fetch(url, { method: 'PUT', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) alert('Save failed'); else await reload();
  }

  async function del(kind:'pillar'|'theme'|'sub'|'std', id:string) {
    const msg =
      kind === 'pillar' ? 'Delete this pillar AND all its themes, sub-themes, and standards?' :
      kind === 'theme'  ? 'Delete this theme AND all its sub-themes and standards?' :
      kind === 'sub'    ? 'Delete this sub-theme AND its standards?' :
                          'Delete this standard?';
    if (!confirm(msg)) return;
    const url =
      kind === 'pillar' ? `/api/pillars/${id}` :
      kind === 'theme'  ? `/api/themes/${id}` :
      kind === 'sub'    ? `/api/subthemes/${id}` :
                          `/api/standards/${id}`;
    const res = await fetch(url, { method: 'DELETE' });
    if (!res.ok) alert('Delete failed'); else await reload();
  }

  async function addChild() {
    if (!addingUnder) return;
    const { kind, id } = addingUnder;
    if (kind === 'pillar') {
      const body = {
        pillar_id: id,
        code: addForm.code || '',
        name: addForm.name || '',
        description: addForm.description || '',
        sort_order: addForm.sort_order ? Number(addForm.sort_order) : null,
      };
      const res = await fetch('/api/themes', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
      if (!res.ok) alert('Add theme failed'); else await reload();
    } else if (kind === 'theme') {
      const body = {
        theme_id: id,
        code: addForm.code || '',
        name: addForm.name || '',
        description: addForm.description || '',
        sort_order: addForm.sort_order ? Number(addForm.sort_order) : null,
      };
      const res = await fetch('/api/subthemes', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
      if (!res.ok) alert('Add sub-theme failed'); else await reload();
    } else if (kind === 'sub') {
      const body = {
        subtheme_id: id,
        code: addForm.code ? addForm.code : null,
        description: addForm.description || '',
        notes: addForm.notes ? addForm.notes : null,
        sort_order: addForm.sort_order ? Number(addForm.sort_order) : null,
      };
      const res = await fetch('/api/standards', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
      if (!res.ok) alert('Add standard failed'); else await reload();
    }
  }

  // NEW: clean cancel helper (fixes TS error)
  function cancelEdit() {
    setForm({});
    setEditing(null);
  }

  const toggleP = (id: string) => setCollapsedP(m => ({ ...m, [id]: !m[id] }));
  const toggleT = (id: string) => setCollapsedT(m => ({ ...m, [id]: !m[id] }));
  const expandAll = () => { setCollapsedP({}); setCollapsedT({}); };
  const collapseAll = () => {
    const p: Record<string, boolean> = {};
    const t: Record<string, boolean> = {};
    for (const P of tree) { if (P.pillar_id) p[P.pillar_id] = true; for (const T of P.themes) if (T.theme_id) t[T.theme_id] = true; }
    setCollapsedP(p); setCollapsedT(t);
  };

  return (
    <main style={{ padding: 24, maxWidth: '100%', margin: '0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom: 8, flexWrap:'wrap' }}>
        <Link href="/" style={{ textDecoration:'none' }}>← Back to Home</Link>
        <div style={{ marginLeft: 'auto', display:'flex', gap:10 }}>
          <a href="/api/export">Download CSV</a>
          <button onClick={expandAll}>Expand all</button>
          <button onClick={collapseAll}>Collapse all</button>
          <label style={{ display:'flex', alignItems:'center', gap:6 }}>
            <input type="checkbox" checked={editMode} onChange={e=>{ setEditMode(e.target.checked); setEditing(null); setAddingUnder(null); }} />
            Edit mode
          </label>
        </div>
      </div>

      <h1>Framework Table</h1>
      <p style={{ opacity: 0.8, marginBottom: 8 }}>
        Read-only by default. Toggle <b>Edit mode</b> to inline edit, add, or delete items.
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
      </div>

      {loading && <p>Loading…</p>}
      {err && <p style={{ color:'crimson' }}>{err}</p>}

      <div style={{ overflow: 'auto', border:'1px solid #eee', borderRadius:8 }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background:'#fafafa', borderBottom:'1px solid #eee' }}>
              {editMode && <Th label="" />}
              <Th label="Pillar" />
              <Th label="Theme" />
              <Th label="Sub-theme" />
              <Th label="Standard Description" />
              <Th label="Indicator Name" />
              <Th label="Indicator Description" />
            </tr>
          </thead>
          <tbody>
            {renderRows({
              tree,
              collapsedP,
              collapsedT,
              toggleP,
              toggleT,
              editMode,
              beginEdit,
              del,
              addingUnder,
              setAddingUnder,
              addForm,
              setAddForm,
              addChild,
              pillarDescById,
              themeDescById,
              subDescById,
              defIndByPillarId,
              defIndByThemeId,
              defIndBySubId,
              editing,
              form,
              setForm,
              saveEdit,
              cancelEdit,   // << pass clean cancel
            })}
            {tree.length === 0 && !loading && (
              <tr><td style={{ padding:12 }} colSpan={editMode ? 7 : 6}>No matching rows.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

/* ---------- render with inline edit/add/delete ---------- */
function renderRows(args: {
  tree: ReturnType<typeof buildTree>,
  collapsedP: Record<string, boolean>,
  collapsedT: Record<string, boolean>,
  toggleP: (id:string)=>void,
  toggleT: (id:string)=>void,
  editMode: boolean,
  beginEdit: (kind:'pillar'|'theme'|'sub'|'std', id:string, seed:Record<string,string>)=>void,
  del: (kind:'pillar'|'theme'|'sub'|'std', id:string)=>Promise<void>,
  addingUnder: { kind:'pillar'|'theme'|'sub'; id:string }|null,
  setAddingUnder: (x:{ kind:'pillar'|'theme'|'sub'; id:string }|null)=>void,
  addForm: Record<string,string>,
  setAddForm: (s:Record<string,string>)=>void,
  addChild: ()=>Promise<void>,
  pillarDescById: Map<string,string>,
  themeDescById: Map<string,string>,
  subDescById: Map<string,string>,
  defIndByPillarId: Map<string, Indicator>,
  defIndByThemeId: Map<string, Indicator>,
  defIndBySubId: Map<string, Indicator>,
  editing: { kind:'pillar'|'theme'|'sub'|'std'; id:string }|null,
  form: Record<string,string>,
  setForm: (s:Record<string,string>)=>void,
  saveEdit: ()=>Promise<void>,
  cancelEdit: ()=>void, // << new
}) {
  const out: ReactNode[] = [];
  const td: React.CSSProperties = { padding:'8px', whiteSpace:'nowrap', verticalAlign:'top' };
  const tdWrap: React.CSSProperties = { padding:'8px', whiteSpace:'normal', maxWidth: 520, lineHeight: 1.3 };
  const btnLink: React.CSSProperties = { background:'none', border:'1px solid #ddd', borderRadius:6, padding:'2px 6px', cursor:'pointer' };
  const btnIcon: React.CSSProperties = { background:'none', border:'none', cursor:'pointer', fontSize: 14 };

  for (const P of args.tree) {
    const pCollapsed = !!args.collapsedP[P.pillar_id];
    const pDesc = args.pillarDescById.get(P.pillar_id) || '';
    const pDef = args.defIndByPillarId.get(P.pillar_id);

    const pEditing = args.editing?.kind === 'pillar' && args.editing?.id === P.pillar_id;

    out.push(
      <tr key={`p-${P.pillar_id}`} style={{ background: COLORS.pillar, borderTop:'1px solid #e6e6e6' }}>
        {args.editMode && (
          <td style={td}>
            {!pEditing && (
              <span style={{ display:'flex', gap:6 }}>
                <button style={btnIcon} title="Edit pillar"
                        onClick={()=>args.beginEdit('pillar', P.pillar_id, { code:P.pillar_code, name:P.pillar_name, description:pDesc, sort_order:String(P.p_so === 999999 ? '' : P.p_so) })}>✏️</button>
                <button style={btnIcon} title="Delete pillar" onClick={()=>args.del('pillar', P.pillar_id)}>🗑️</button>
                <button style={btnIcon} title="Add theme" onClick={()=>{ args.setAddingUnder({ kind:'pillar', id:P.pillar_id }); args.setAddForm({ code:'', name:'', description:'', sort_order:'' }); }}>➕</button>
              </span>
            )}
            {pEditing && (
              <span style={{ display:'flex', gap:6 }}>
                <button style={btnLink} onClick={args.saveEdit}>Save</button>
                <button style={btnLink} onClick={args.cancelEdit}>Cancel</button>
              </span>
            )}
          </td>
        )}
        <td style={td}>
          <button onClick={()=>args.toggleP(P.pillar_id)} style={{ background:'none', border:'none', cursor:'pointer' }}>
            {pCollapsed ? '▶' : '▼'} {pEditing ? (
              <InlineInputs kind="pillar" form={args.form} setForm={args.setForm} />
            ) : (
              <b>{P.pillar_name}</b>
            )}
          </button>
        </td>
        <td style={td}></td>
        <td style={td}></td>
        <td style={tdWrap}>{pEditing ? <TextareaSmall name="description" form={args.form} setForm={args.setForm} /> : pDesc}</td>
        <td style={td}>{pDef?.name || ''}</td>
        <td style={tdWrap}>{pDef?.description || ''}</td>
      </tr>
    );

    if (args.addingUnder?.kind === 'pillar' && args.addingUnder?.id === P.pillar_id && args.editMode) {
      out.push(
        <tr key={`p-add-${P.pillar_id}`} style={{ background: COLORS.theme }}>
          {args.editMode && <td style={td}></td>}
          <td style={td}></td>
          <td style={td} colSpan={2}>
            <b>New Theme under {P.pillar_name}</b>
            <InlineAddFields fields={['code','name','sort_order']} addForm={args.addForm} setAddForm={args.setAddForm} />
          </td>
          <td style={tdWrap}><TextareaSmall name="description" form={args.addForm} setForm={args.setAddForm} /></td>
          <td style={td}>
            <button style={btnLink} onClick={args.addChild}>Add Theme</button>
            <button style={btnLink} onClick={()=>args.setAddingUnder(null)}>Cancel</button>
          </td>
          <td style={td}></td>
        </tr>
      );
    }

    if (pCollapsed) continue;

    for (const T of P.themes) {
      const tCollapsed = !!args.collapsedT[T.theme_id];
      const tDesc = args.themeDescById.get(T.theme_id) || '';
      const tDef = args.defIndByThemeId.get(T.theme_id);
      const tEditing = args.editing?.kind === 'theme' && args.editing?.id === T.theme_id;

      out.push(
        <tr key={`t-${T.theme_id}`} style={{ background: COLORS.theme }}>
          {args.editMode && (
            <td style={td}>
              {!tEditing && (
                <span style={{ display:'flex', gap:6 }}>
                  <button style={btnIcon} title="Edit theme"
                          onClick={()=>args.beginEdit('theme', T.theme_id, { code:T.theme_code, name:T.theme_name, description:tDesc, sort_order:String(T.t_so === 999999 ? '' : T.t_so) })}>✏️</button>
                  <button style={btnIcon} title="Delete theme" onClick={()=>args.del('theme', T.theme_id)}>🗑️</button>
                  <button style={btnIcon} title="Add sub-theme" onClick={()=>{ args.setAddingUnder({ kind:'theme', id:T.theme_id }); args.setAddForm({ code:'', name:'', description:'', sort_order:'' }); }}>➕</button>
                </span>
              )}
              {tEditing && (
                <span style={{ display:'flex', gap:6 }}>
                  <button style={btnLink} onClick={args.saveEdit}>Save</button>
                  <button style={btnLink} onClick={args.cancelEdit}>Cancel</button>
                </span>
              )}
            </td>
          )}
          <td style={td}></td>
          <td style={td}>
            <button onClick={()=>args.toggleT(T.theme_id)} style={{ background:'none', border:'none', cursor:'pointer' }}>
              {tCollapsed ? '▶' : '▼'} {tEditing ? <InlineInputs kind="theme" form={args.form} setForm={args.setForm} /> : <b>{T.theme_name}</b>}
            </button>
          </td>
          <td style={td}></td>
          <td style={tdWrap}>{tEditing ? <TextareaSmall name="description" form={args.form} setForm={args.setForm} /> : tDesc}</td>
          <td style={td}>{tDef?.name || ''}</td>
          <td style={tdWrap}>{tDef?.description || ''}</td>
        </tr>
      );

      if (args.addingUnder?.kind === 'theme' && args.addingUnder?.id === T.theme_id && args.editMode) {
        out.push(
          <tr key={`t-add-${T.theme_id}`} style={{ background: COLORS.sub }}>
            {args.editMode && <td style={td}></td>}
            <td style={td}></td>
            <td style={td}></td>
            <td style={td}>
              <b>New Sub-theme under {T.theme_name}</b>
              <InlineAddFields fields={['code','name','sort_order']} addForm={args.addForm} setAddForm={args.setAddForm} />
            </td>
            <td style={tdWrap}><TextareaSmall name="description" form={args.addForm} setForm={args.setAddForm} /></td>
            <td style={td}>
              <button style={btnLink} onClick={args.addChild}>Add Sub-theme</button>
              <button style={btnLink} onClick={()=>args.setAddingUnder(null)}>Cancel</button>
            </td>
            <td style={td}></td>
          </tr>
        );
      }

      if (tCollapsed) continue;

      for (const S of T.subthemes) {
        const sDesc = args.subDescById.get(S.subtheme_id) || '';
        const sDef = args.defIndBySubId.get(S.subtheme_id);
        const sEditing = args.editing?.kind === 'sub' && args.editing?.id === S.subtheme_id;

        out.push(
          <tr key={`s-${S.subtheme_id}-summary`} style={{ background: COLORS.sub }}>
            {args.editMode && (
              <td style={td}>
                {!sEditing && (
                  <span style={{ display:'flex', gap:6 }}>
                    <button style={btnIcon} title="Edit sub-theme"
                            onClick={()=>args.beginEdit('sub', S.subtheme_id, { code:S.subtheme_code, name:S.subtheme_name, description:sDesc, sort_order:String(S.s_so === 999999 ? '' : S.s_so) })}>✏️</button>
                    <button style={btnIcon} title="Delete sub-theme" onClick={()=>args.del('sub', S.subtheme_id)}>🗑️</button>
                    <button style={btnIcon} title="Add standard" onClick={()=>{ args.setAddingUnder({ kind:'sub', id:S.subtheme_id }); args.setAddForm({ code:'', description:'', notes:'', sort_order:'' }); }}>➕</button>
                  </span>
                )}
                {sEditing && (
                  <span style={{ display:'flex', gap:6 }}>
                    <button style={btnLink} onClick={args.saveEdit}>Save</button>
                    <button style={btnLink} onClick={args.cancelEdit}>Cancel</button>
                  </span>
                )}
              </td>
            )}
            <td style={td}></td>
            <td style={td}></td>
            <td style={td}>{sEditing ? <InlineInputs kind="sub" form={args.form} setForm={args.setForm} /> : <b>{S.subtheme_name}</b>}</td>
            <td style={tdWrap}>{sEditing ? <TextareaSmall name="description" form={args.form} setForm={args.setForm} /> : sDesc}</td>
            <td style={td}>{sDef?.name || ''}</td>
            <td style={tdWrap}>{sDef?.description || ''}</td>
          </tr>
        );

        if (args.addingUnder?.kind === 'sub' && args.addingUnder?.id === S.subtheme_id && args.editMode) {
          out.push(
            <tr key={`s-add-${S.subtheme_id}`} style={{ background: '#fff' }}>
              {args.editMode && <td style={td}></td>}
              <td style={td}></td>
              <td style={td}></td>
              <td style={td}></td>
              <td style={tdWrap}>
                <b>New Standard under {S.subtheme_name}</b>
                <InlineAddFields fields={['code','sort_order']} addForm={args.addForm} setAddForm={args.setAddForm} />
                <TextareaSmall name="description" label="Description" form={args.addForm} setForm={args.setAddForm} />
                <TextareaSmall name="notes" label="Notes (optional)" form={args.addForm} setForm={args.setAddForm} />
              </td>
              <td style={td}>
                <button style={btnLink} onClick={args.addChild}>Add Standard</button>
                <button style={btnLink} onClick={()=>args.setAddingUnder(null)}>Cancel</button>
              </td>
              <td style={td}></td>
            </tr>
          );
        }

        // Standards rows
        for (const r of S.rows) {
          const stdEditing = args.editing?.kind === 'std' && args.editing?.id === r.standard_id;
          out.push(
            <tr key={`r-${r.standard_id}-${r.indicator_name}-${r.indicator_description}`} style={{ borderTop:'1px solid #f2f2f2' }}>
              {args.editMode && (
                <td style={td}>
                  {!stdEditing ? (
                    <span style={{ display:'flex', gap:6 }}>
                      <button style={btnIcon} title="Edit standard"
                              onClick={()=>args.beginEdit('std', r.standard_id!, {
                                code:'',
                                description:r.standard_description,
                                notes:'',
                                sort_order:String(r.std_so === 999999 ? '' : r.std_so)
                              })}>✏️</button>
                      <button style={btnIcon} title="Delete standard" onClick={()=>args.del('std', r.standard_id!)}>🗑️</button>
                    </span>
                  ) : (
                    <span style={{ display:'flex', gap:6 }}>
                      <button style={btnLink} onClick={args.saveEdit}>Save</button>
                      <button style={btnLink} onClick={args.cancelEdit}>Cancel</button>
                    </span>
                  )}
                </td>
              )}
              <td style={td}></td>
              <td style={td}></td>
              <td style={td}></td>
              <td style={tdWrap}>
                {stdEditing ? <TextareaSmall name="description" form={args.form} setForm={args.setForm} /> : r.standard_description}
                {stdEditing && (
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:6 }}>
                    <InputSmall name="code" label="Code (optional)" form={args.form} setForm={args.setForm} />
                    <InputSmall name="sort_order" label="Sort order" form={args.form} setForm={args.setForm} />
                    <TextareaSmall name="notes" label="Notes (optional)" form={args.form} setForm={args.setForm} />
                  </div>
                )}
              </td>
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

/* ---------- helpers ---------- */
function InlineInputs({ kind, form, setForm }:{ kind:'pillar'|'theme'|'sub'; form:Record<string,string>; setForm:(s:Record<string,string>)=>void }) {
  return (
    <span style={{ display:'inline-grid', gridTemplateColumns:'auto auto auto', gap:6 }}>
      <InputSmall name="code" label="Code" form={form} setForm={setForm} />
      <InputSmall name="name" label="Name" form={form} setForm={setForm} />
      <InputSmall name="sort_order" label="Sort order" form={form} setForm={setForm} />
    </span>
  );
}
function InlineAddFields({ fields, addForm, setAddForm }:{ fields:('code'|'name'|'sort_order')[]; addForm:Record<string,string>; setAddForm:(s:Record<string,string>)=>void }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(120px, 1fr))', gap:8, marginTop:6 }}>
      {fields.includes('code') && <InputSmall name="code" label="Code" form={addForm} setForm={setAddForm} />}
      {fields.includes('name') && <InputSmall name="name" label="Name" form={addForm} setForm={setAddForm} />}
      {fields.includes('sort_order') && <InputSmall name="sort_order" label="Sort order" form={addForm} setForm={setAddForm} />}
    </div>
  );
}
function InputSmall({ name, label, form, setForm }:{ name:string; label:string; form:Record<string,string>; setForm:(s:Record<string,string>)=>void }) {
  return (
    <label style={{ display:'grid', gap:4, fontSize:12 }}>
      <span>{label}</span>
      <input value={form[name] || ''} onChange={e=>setForm({ ...form, [name]: e.target.value })}
             style={{ padding:'6px 8px', border:'1px solid #ddd', borderRadius:6 }} />
    </label>
  );
}
function TextareaSmall({ name, label = 'Description', form, setForm }:{ name:string; label?:string; form:Record<string,string>; setForm:(s:Record<string,string>)=>void }) {
  return (
    <label style={{ display:'grid', gap:4, fontSize:12 }}>
      <span>{label}</span>
      <textarea value={form[name] || ''} onChange={e=>setForm({ ...form, [name]: e.target.value })}
                rows={3} style={{ padding:'6px 8px', border:'1px solid #ddd', borderRadius:6, width:'100%' }} />
    </label>
  );
}
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

/* ---------- tree builder ---------- */
function buildTree(rows: Row[]) {
  type SubNode = { subtheme_id: string; subtheme_code: string; subtheme_name: string; s_so: number; rows: Row[] };
  type ThemeNode = { theme_id: string; theme_code: string; theme_name: string; t_so: number; subthemes: SubNode[] };
  type PillarNode = { pillar_id: string; pillar_code: string; pillar_name: string; p_so: number; themes: ThemeNode[] };

  const pMap = new Map<string, PillarNode>();
  const tMap = new Map<string, ThemeNode>();

  for (const r of rows) {
    let P = pMap.get(r.pillar_id);
    if (!P) {
      P = { pillar_id: r.pillar_id, pillar_code: r.pillar_code, pillar_name: r.pillar_name, p_so: r.p_so, themes: [] };
      pMap.set(r.pillar_id, P);
    }

    const tKey = r.pillar_id + '|' + r.theme_id;
    let T = tMap.get(tKey);
    if (!T) {
      T = { theme_id: r.theme_id, theme_code: r.theme_code, theme_name: r.theme_name, t_so: r.t_so, subthemes: [] };
      tMap.set(tKey, T);
      P.themes.push(T);
    }

    let S = T.subthemes.find(x => x.subtheme_id === r.subtheme_id);
    if (!S) {
      S = { subtheme_id: r.subtheme_id, subtheme_code: r.subtheme_code, subtheme_name: r.subtheme_name, s_so: r.s_so, rows: [] };
      T.subthemes.push(S);
    }

    S.rows.push(r);
  }

  // keep framework order on groups
  const cmp = (a:number,b:number)=> (a-b);
  const alpha = (a:string,b:string)=> a.localeCompare(b, undefined, { numeric:true });
  const pillars = Array.from(pMap.values()).sort((a,b)=> cmp(a.p_so,b.p_so) || alpha(a.pillar_name,b.pillar_name));
  for (const P of pillars) {
    P.themes.sort((a,b)=> cmp(a.t_so,b.t_so) || alpha(a.theme_name,b.theme_name));
    for (const T of P.themes) T.subthemes.sort((a,b)=> cmp(a.s_so,b.s_so) || alpha(a.subtheme_name,b.subtheme_name));
  }
  return pillars;
}
