// app/framework/page.tsx
'use client';
import { useEffect, useMemo, useState } from 'react';

type Pillar = { id: string; code: string; name: string; statement?: string|null; description?: string|null; sort_order: number|null; };
type Theme = { id: string; pillar_id: string; code: string; name: string; statement?: string|null; description?: string|null; sort_order: number|null; };
type Subtheme = { id: string; theme_id: string; code: string; name: string; statement?: string|null; description?: string|null; sort_order: number|null; };
type Standard = { id: string; subtheme_id: string; code: string; statement: string; notes?: string|null; sort_order: number|null; };

export default function FrameworkPage() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [subs, setSubs] = useState<Subtheme[]>([]);
  const [stds, setStds] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string|null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    const [pR, tR, sR, dR] = await Promise.all([
      fetch('/api/pillars', { cache: 'no-store' }),
      fetch('/api/themes', { cache: 'no-store' }),
      fetch('/api/subthemes', { cache: 'no-store' }),
      fetch('/api/standards', { cache: 'no-store' }),
    ]);
    const [p, t, s, d] = await Promise.all([pR.json(), tR.json(), sR.json(), dR.json()]);
    if (!pR.ok) setErr(p?.error || 'Failed to load pillars');
    if (!tR.ok) setErr(t?.error || 'Failed to load themes');
    if (!sR.ok) setErr(s?.error || 'Failed to load sub-themes');
    if (!dR.ok) setErr(d?.error || 'Failed to load standards');
    if (pR.ok) setPillars(p);
    if (tR.ok) setThemes(t);
    if (sR.ok) setSubs(s);
    if (dR.ok) setStds(d);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const themesByPillar = useMemo(() => {
    const m: Record<string, Theme[]> = {};
    for (const t of themes) (m[t.pillar_id] ||= []).push(t);
    return m;
  }, [themes]);

  const subsByTheme = useMemo(() => {
    const m: Record<string, Subtheme[]> = {};
    for (const st of subs) (m[st.theme_id] ||= []).push(st);
    return m;
  }, [subs]);

  const stdsBySub = useMemo(() => {
    const m: Record<string, Standard[]> = {};
    for (const sd of stds) (m[sd.subtheme_id] ||= []).push(sd);
    return m;
  }, [stds]);

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1>SSC Framework — Pillars, Themes, Sub-themes & Standards</h1>
      <p style={{ opacity: 0.8 }}>Add items top-down. All changes save live.</p>

      <AddPillar onDone={load} />

      {loading && <p>Loading…</p>}
      {err && <p style={{ color: 'crimson' }}>{err}</p>}

      <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        {pillars.map(p => (
          <details key={p.id} open>
            <summary><b>{p.code}</b> — {p.name}</summary>

            <PillarCard p={p} onChanged={load} onDeleted={load} />

            {/* THEMES */}
            <section style={{ margin: '8px 0 12px', paddingLeft: 12, borderLeft: '2px solid #eee' }}>
              <h3 style={{ margin: '8px 0' }}>Themes</h3>
              <AddTheme pillar={p} onDone={load} />
              <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                {(themesByPillar[p.id] || []).map(t => (
                  <details key={t.id} style={{ marginLeft: 8 }}>
                    <summary><b>{t.code}</b> — {t.name}</summary>
                    <ThemeCard t={t} onChanged={load} onDeleted={load} />

                    {/* SUB-THEMES */}
                    <section style={{ margin: '6px 0 10px', paddingLeft: 12, borderLeft: '2px dashed #eee' }}>
                      <b>Sub-themes</b>
                      <AddSubtheme theme={t} onDone={load} />
                      <div style={{ display: 'grid', gap: 6, marginTop: 6 }}>
                        {(subsByTheme[t.id] || []).map(st => (
                          <details key={st.id} style={{ marginLeft: 8 }}>
                            <summary><b>{st.code}</b> — {st.name}</summary>
                            <SubthemeCard st={st} onChanged={load} onDeleted={load} />

                            {/* STANDARDS */}
                            <section style={{ margin: '6px 0 10px', paddingLeft: 12, borderLeft: '2px dotted #eee' }}>
                              <b>Standards</b>
                              <AddStandard subtheme={st} onDone={load} />
                              <div style={{ display: 'grid', gap: 6, marginTop: 6 }}>
                                {(stdsBySub[st.id] || []).map(sd => (
                                  <StandardCard key={sd.id} sd={sd} onChanged={load} onDeleted={load} />
                                ))}
                                {(stdsBySub[st.id] || []).length === 0 && (
                                  <div style={{ opacity: 0.7 }}>No standards yet for {st.code}.</div>
                                )}
                              </div>
                            </section>
                          </details>
                        ))}
                        {(subsByTheme[t.id] || []).length === 0 && (
                          <div style={{ opacity: 0.7 }}>No sub-themes yet for {t.code}.</div>
                        )}
                      </div>
                    </section>
                  </details>
                ))}
                {(themesByPillar[p.id] || []).length === 0 && (
                  <div style={{ opacity: 0.7 }}>No themes yet for {p.code}.</div>
                )}
              </div>
            </section>
          </details>
        ))}
        {!loading && pillars.length === 0 && <p>No pillars yet — add your first one above.</p>}
      </div>
    </main>
  );
}

/* ---------------- Pillars ------------------ */
function AddPillar({ onDone }: { onDone: () => void }) {
  const [code, setCode] = useState(''); const [name, setName] = useState('');
  const [statement, setStatement] = useState(''); const [description, setDescription] = useState('');
  const [sort, setSort] = useState<number|''>(''); const [saving, setSaving] = useState(false); const [msg, setMsg] = useState<string|null>(null);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg(null);
    const res = await fetch('/api/pillars', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.trim(), name: name.trim(), statement: statement.trim() || null, description: description.trim() || null, sort_order: sort === '' ? 1 : Number(sort) }) });
    const data = await res.json(); setSaving(false);
    if (!res.ok) setMsg(data?.error || 'Failed to save'); else { setCode(''); setName(''); setStatement(''); setDescription(''); setSort(''); onDone(); }
  }
  return (
    <form onSubmit={submit} style={{ display:'grid', gap:8, padding:12, border:'1px solid #ddd', borderRadius:8 }}>
      <h2 style={{ margin:0 }}>Add Pillar</h2>
      <div style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 2fr' }}>
        <label>Code</label><input value={code} onChange={e=>setCode(e.target.value)} required />
        <label>Name</label><input value={name} onChange={e=>setName(e.target.value)} required />
        <label>Statement</label><input value={statement} onChange={e=>setStatement(e.target.value)} />
        <label>Description</label><input value={description} onChange={e=>setDescription(e.target.value)} />
        <label>Sort</label><input type="number" value={sort} onChange={e=>setSort(e.target.value===''?'':Number(e.target.value))} placeholder="1" />
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button type="submit" disabled={saving}>{saving?'Saving…':'Add Pillar'}</button>
        {msg && <span style={{ color:'crimson' }}>{msg}</span>}
      </div>
    </form>
  );
}
function PillarCard({ p, onChanged, onDeleted }: { p:Pillar; onChanged:()=>void; onDeleted:()=>void }) {
  const [edit, setEdit] = useState(false);
  const [code, setCode] = useState(p.code); const [name, setName] = useState(p.name);
  const [statement, setStatement] = useState(p.statement||''); const [description, setDescription] = useState(p.description||'');
  const [sort, setSort] = useState<number|''>(p.sort_order ?? 1); const [saving, setSaving] = useState(false); const [msg, setMsg] = useState<string|null>(null);
  async function save(){
    setSaving(true); setMsg(null);
    const res = await fetch(`/api/pillars/${p.id}`, { method:'PUT', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ code:code.trim(), name:name.trim(), statement:statement.trim()||null, description:description.trim()||null, sort_order: sort===''?1:Number(sort) })});
    const data = await res.json(); setSaving(false);
    if(!res.ok) setMsg(data?.error||'Failed to update'); else { setEdit(false); onChanged(); }
  }
  async function del(){ if(!confirm(`Delete pillar ${p.code}?`)) return; const res = await fetch(`/api/pillars/${p.id}`,{method:'DELETE'}); const data=await res.json(); if(!res.ok) alert(data?.error||'Delete failed'); else onDeleted(); }
  return (
    <div style={{ border:'1px solid #eee', borderRadius:8, padding:12, marginTop:8 }}>
      {!edit?(
        <>
          <div style={{ display:'flex', justifyContent:'space-between', gap:12 }}>
            <b>{p.code}</b>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>setEdit(true)}>Edit</button><button onClick={del}>Delete</button>
            </div>
          </div>
          <div style={{ opacity:0.9 }}>{p.name}</div>
          {p.statement && <div style={{ marginTop:6 }}><i>{p.statement}</i></div>}
          {p.description && <div style={{ marginTop:6 }}>{p.description}</div>}
          <div style={{ marginTop:6, fontSize:12, opacity:0.7 }}>Sort: {p.sort_order ?? 1}</div>
        </>
      ):(
        <div style={{ display:'grid', gap:8 }}>
          <div style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 2fr' }}>
            <label>Code</label><input value={code} onChange={e=>setCode(e.target.value)} required />
            <label>Name</label><input value={name} onChange={e=>setName(e.target.value)} required />
            <label>Statement</label><input value={statement} onChange={e=>setStatement(e.target.value)} />
            <label>Description</label><input value={description} onChange={e=>setDescription(e.target.value)} />
            <label>Sort</label><input type="number" value={sort} onChange={e=>setSort(e.target.value===''?'':Number(e.target.value))} />
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={save} disabled={saving}>{saving?'Saving…':'Save'}</button>
            <button onClick={()=>setEdit(false)} disabled={saving}>Cancel</button>
            {msg && <span style={{ color:'crimson' }}>{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Themes ------------------ */
function AddTheme({ pillar, onDone }:{ pillar:Pillar; onDone:()=>void }) {
  const [code, setCode] = useState(''); const [name, setName] = useState('');
  const [statement, setStatement] = useState(''); const [description, setDescription] = useState('');
  const [sort, setSort] = useState<number|''>(''); const [saving, setSaving] = useState(false); const [msg, setMsg] = useState<string|null>(null);
  async function submit(e:React.FormEvent){ e.preventDefault(); setSaving(true); setMsg(null);
    const res = await fetch('/api/themes',{method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ pillar_id:pillar.id, code:code.trim(), name:name.trim(), statement:statement.trim()||null, description:description.trim()||null, sort_order:sort===''?1:Number(sort) })});
    const data=await res.json(); setSaving(false);
    if(!res.ok) setMsg(data?.error||'Failed to save'); else { setCode(''); setName(''); setStatement(''); setDescription(''); setSort(''); onDone(); }
  }
  return (
    <form onSubmit={submit} style={{ display:'grid', gap:8, padding:10, border:'1px dashed #ddd', borderRadius:8, background:'#fafafa' }}>
      <b>Add Theme to {pillar.code}</b>
      <div style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 2fr' }}>
        <label>Code (e.g. T1.1)</label><input value={code} onChange={e=>setCode(e.target.value)} required />
        <label>Name</label><input value={name} onChange={e=>setName(e.target.value)} required />
        <label>Statement</label><input value={statement} onChange={e=>setStatement(e.target.value)} />
        <label>Description</label><input value={description} onChange={e=>setDescription(e.target.value)} />
        <label>Sort</label><input type="number" value={sort} onChange={e=>setSort(e.target.value===''?'':Number(e.target.value))} placeholder="1" />
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button type="submit" disabled={saving}>{saving?'Saving…':'Add Theme'}</button>
        {msg && <span style={{ color:'crimson' }}>{msg}</span>}
      </div>
    </form>
  );
}
function ThemeCard({ t, onChanged, onDeleted }:{ t:Theme; onChanged:()=>void; onDeleted:()=>void }) {
  const [edit, setEdit] = useState(false);
  const [code, setCode] = useState(t.code); const [name, setName] = useState(t.name);
  const [statement, setStatement] = useState(t.statement||''); const [description, setDescription] = useState(t.description||'');
  const [sort, setSort] = useState<number|''>(t.sort_order ?? 1); const [saving, setSaving] = useState(false); const [msg, setMsg] = useState<string|null>(null);
  async function save(){
    setSaving(true); setMsg(null);
    const res = await fetch(`/api/themes/${t.id}`,{method:'PUT', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ code:code.trim(), name:name.trim(), statement:statement.trim()||null, description:description.trim()||null, sort_order: sort===''?1:Number(sort) })});
    const data=await res.json(); setSaving(false);
    if(!res.ok) setMsg(data?.error||'Failed to update'); else { setEdit(false); onChanged(); }
  }
  async function del(){ if(!confirm(`Delete theme ${t.code}?`)) return;
    const res = await fetch(`/api/themes/${t.id}`, { method:'DELETE' }); const data=await res.json();
    if(!res.ok) alert(data?.error||'Delete failed'); else onDeleted();
  }
  return (
    <div style={{ border:'1px solid #eee', borderRadius:8, padding:10, marginTop:6 }}>
      {!edit?(
        <>
          <div style={{ display:'flex', justifyContent:'space-between', gap:12 }}>
            <b>{t.code}</b>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>setEdit(true)}>Edit</button><button onClick={del}>Delete</button>
            </div>
          </div>
          <div style={{ opacity:0.9 }}>{t.name}</div>
          {t.statement && <div style={{ marginTop:6 }}><i>{t.statement}</i></div>}
          {t.description && <div style={{ marginTop:6 }}>{t.description}</div>}
          <div style={{ marginTop:6, fontSize:12, opacity:0.7 }}>Sort: {t.sort_order ?? 1}</div>
        </>
      ):(
        <div style={{ display:'grid', gap:8 }}>
          <div style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 2fr' }}>
            <label>Code</label><input value={code} onChange={e=>setCode(e.target.value)} required />
            <label>Name</label><input value={name} onChange={e=>setName(e.target.value)} required />
            <label>Statement</label><input value={statement} onChange={e=>setStatement(e.target.value)} />
            <label>Description</label><input value={description} onChange={e=>setDescription(e.target.value)} />
            <label>Sort</label><input type="number" value={sort} onChange={e=>setSort(e.target.value===''?'':Number(e.target.value))} />
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={save} disabled={saving}>{saving?'Saving…':'Save'}</button>
            <button onClick={()=>setEdit(false)} disabled={saving}>Cancel</button>
            {msg && <span style={{ color:'crimson' }}>{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------- Sub-themes ---------------- */
function AddSubtheme({ theme, onDone }:{ theme:Theme; onDone:()=>void }) {
  const [code, setCode] = useState(''); const [name, setName] = useState('');
  const [statement, setStatement] = useState(''); const [description, setDescription] = useState('');
  const [sort, setSort] = useState<number|''>(''); const [saving, setSaving] = useState(false); const [msg, setMsg] = useState<string|null>(null);
  async function submit(e:React.FormEvent){ e.preventDefault(); setSaving(true); setMsg(null);
    const res = await fetch('/api/subthemes',{method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ theme_id:theme.id, code:code.trim(), name:name.trim(), statement:statement.trim()||null, description:description.trim()||null, sort_order: sort===''?1:Number(sort) })});
    const data=await res.json(); setSaving(false);
    if(!res.ok) setMsg(data?.error||'Failed to save'); else { setCode(''); setName(''); setStatement(''); setDescription(''); setSort(''); onDone(); }
  }
  return (
    <form onSubmit={submit} style={{ display:'grid', gap:8, padding:10, border:'1px dashed #ddd', borderRadius:8, background:'#fbfbfb', marginTop:6 }}>
      <b>Add Sub-theme to {theme.code}</b>
      <div style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 2fr' }}>
        <label>Code (e.g. ST1.1.1)</label><input value={code} onChange={e=>setCode(e.target.value)} required />
        <label>Name</label><input value={name} onChange={e=>setName(e.target.value)} required />
        <label>Statement</label><input value={statement} onChange={e=>setStatement(e.target.value)} />
        <label>Description</label><input value={description} onChange={e=>setDescription(e.target.value)} />
        <label>Sort</label><input type="number" value={sort} onChange={e=>setSort(e.target.value===''?'':Number(e.target.value))} placeholder="1" />
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button type="submit" disabled={saving}>{saving?'Saving…':'Add Sub-theme'}</button>
        {msg && <span style={{ color:'crimson' }}>{msg}</span>}
      </div>
    </form>
  );
}
function SubthemeCard({ st, onChanged, onDeleted }:{ st:Subtheme; onChanged:()=>void; onDeleted:()=>void }) {
  const [edit, setEdit] = useState(false);
  const [code, setCode] = useState(st.code); const [name, setName] = useState(st.name);
  const [statement, setStatement] = useState(st.statement||''); const [description, setDescription] = useState(st.description||'');
  const [sort, setSort] = useState<number|''>(st.sort_order ?? 1); const [saving, setSaving] = useState(false); const [msg, setMsg] = useState<string|null>(null);
  async function save(){
    setSaving(true); setMsg(null);
    const res = await fetch(`/api/subthemes/${st.id}`,{method:'PUT', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ code:code.trim(), name:name.trim(), statement:statement.trim()||null, description:description.trim()||null, sort_order: sort===''?1:Number(sort) })});
    const data=await res.json(); setSaving(false);
    if(!res.ok) setMsg(data?.error||'Failed to update'); else { setEdit(false); onChanged(); }
  }
  async function del(){ if(!confirm(`Delete sub-theme ${st.code}?`)) return;
    const res = await fetch(`/api/subthemes/${st.id}`, { method:'DELETE' }); const data=await res.json();
    if(!res.ok) alert(data?.error||'Delete failed'); else onDeleted();
  }
  return (
    <div style={{ border:'1px solid #eee', borderRadius:8, padding:10, marginTop:6 }}>
      {!edit?(
        <>
          <div style={{ display:'flex', justifyContent:'space-between', gap:12 }}>
            <b>{st.code}</b>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>setEdit(true)}>Edit</button><button onClick={del}>Delete</button>
            </div>
          </div>
          <div style={{ opacity:0.9 }}>{st.name}</div>
          {st.statement && <div style={{ marginTop:6 }}><i>{st.statement}</i></div>}
          {st.description && <div style={{ marginTop:6 }}>{st.description}</div>}
          <div style={{ marginTop:6, fontSize:12, opacity:0.7 }}>Sort: {st.sort_order ?? 1}</div>
        </>
      ):(
        <div style={{ display:'grid', gap:8 }}>
          <div style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 2fr' }}>
            <label>Code</label><input value={code} onChange={e=>setCode(e.target.value)} required />
            <label>Name</label><input value={name} onChange={e=>setName(e.target.value)} required />
            <label>Statement</label><input value={statement} onChange={e=>setStatement(e.target.value)} />
            <label>Description</label><input value={description} onChange={e=>setDescription(e.target.value)} />
            <label>Sort</label><input type="number" value={sort} onChange={e=>setSort(e.target.value===''?'':Number(e.target.value))} />
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={save} disabled={saving}>{saving?'Saving…':'Save'}</button>
            <button onClick={()=>setEdit(false)} disabled={saving}>Cancel</button>
            {msg && <span style={{ color:'crimson' }}>{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------- Standards ---------------- */
function AddStandard({ subtheme, onDone }:{ subtheme:Subtheme; onDone:()=>void }) {
  const [code, setCode] = useState(''); const [statement, setStatement] = useState(''); const [notes, setNotes] = useState('');
  const [sort, setSort] = useState<number|''>(''); const [saving, setSaving] = useState(false); const [msg, setMsg] = useState<string|null>(null);
  async function submit(e:React.FormEvent){ e.preventDefault(); setSaving(true); setMsg(null);
    const res = await fetch('/api/standards',{method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ subtheme_id: subtheme.id, code: code.trim(), statement: statement.trim(), notes: notes.trim() || null, sort_order: sort===''?1:Number(sort) })});
    const data=await res.json(); setSaving(false);
    if(!res.ok) setMsg(data?.error||'Failed to save'); else { setCode(''); setStatement(''); setNotes(''); setSort(''); onDone(); }
  }
  return (
    <form onSubmit={submit} style={{ display:'grid', gap:8, padding:8, border:'1px dashed #ddd', borderRadius:8, background:'#fff' }}>
      <b>Add Standard to {subtheme.code}</b>
      <div style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 2fr' }}>
        <label>Code (e.g. STD1.1.1.1)</label><input value={code} onChange={e=>setCode(e.target.value)} required />
        <label>Statement</label><input value={statement} onChange={e=>setStatement(e.target.value)} required />
        <label>Notes</label><input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Optional" />
        <label>Sort</label><input type="number" value={sort} onChange={e=>setSort(e.target.value===''?'':Number(e.target.value))} placeholder="1" />
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button type="submit" disabled={saving}>{saving?'Saving…':'Add Standard'}</button>
        {msg && <span style={{ color:'crimson' }}>{msg}</span>}
      </div>
    </form>
  );
}
function StandardCard({ sd, onChanged, onDeleted }:{ sd:Standard; onChanged:()=>void; onDeleted:()=>void }) {
  const [edit, setEdit] = useState(false);
  const [code, setCode] = useState(sd.code);
  const [statement, setStatement] = useState(sd.statement);
  const [notes, setNotes] = useState(sd.notes || '');
  const [sort, setSort] = useState<number|''>(sd.sort_order ?? 1);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string|null>(null);

  async function save(){
    setSaving(true); setMsg(null);
    const res = await fetch(`/api/standards/${sd.id}`,{method:'PUT', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ code:code.trim(), statement:statement.trim(), notes: notes.trim() || null, sort_order: sort===''?1:Number(sort) })});
    const data=await res.json(); setSaving(false);
    if(!res.ok) setMsg(data?.error||'Failed to update'); else { setEdit(false); onChanged(); }
  }
  async function del(){ if(!confirm(`Delete standard ${sd.code}?`)) return;
    const res = await fetch(`/api/standards/${sd.id}`, { method:'DELETE' }); const data=await res.json();
    if(!res.ok) alert(data?.error||'Delete failed'); else onDeleted();
  }

  return (
    <div style={{ border:'1px solid #eee', borderRadius:8, padding:8 }}>
      {!edit ? (
        <>
          <div style={{ display:'flex', justifyContent:'space-between', gap:12 }}>
            <b>{sd.code}</b>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>setEdit(true)}>Edit</button><button onClick={del}>Delete</button>
            </div>
          </div>
          <div style={{ marginTop:6 }}>{sd.statement}</div>
          {sd.notes && <div style={{ marginTop:6, opacity:0.9 }}>{sd.notes}</div>}
          <div style={{ marginTop:6, fontSize:12, opacity:0.7 }}>Sort: {sd.sort_order ?? 1}</div>
        </>
      ) : (
        <div style={{ display:'grid', gap:8 }}>
          <div style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 2fr' }}>
            <label>Code</label><input value={code} onChange={e=>setCode(e.target.value)} required />
            <label>Statement</label><input value={statement} onChange={e=>setStatement(e.target.value)} required />
            <label>Notes</label><input value={notes} onChange={e=>setNotes(e.target.value)} />
            <label>Sort</label><input type="number" value={sort} onChange={e=>setSort(e.target.value===''?'':Number(e.target.value))} />
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={save} disabled={saving}>{saving?'Saving…':'Save'}</button>
            <button onClick={()=>setEdit(false)} disabled={saving}>Cancel</button>
            {msg && <span style={{ color:'crimson' }}>{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
