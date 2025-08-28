// app/framework/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Pillar = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order: number | null;
};

type Theme = {
  id: string;
  pillar_id: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order: number | null;
};

type Subtheme = {
  id: string;
  theme_id: string;
  code: string;
  name: string;
  description?: string | null;
  sort_order: number | null;
};

type Standard = {
  id: string;
  subtheme_id: string;
  code: string | null;
  description: string;          // CHANGED from statement
  notes?: string | null;
  sort_order: number | null;
};

export default function FrameworkPage() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [subs, setSubs] = useState<Subtheme[]>([]);
  const [stds, setStds] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function loadAll() {
    setLoading(true); setErr(null);
    try {
      const [pR, tR, sR, dR] = await Promise.all([
        fetch('/api/pillars', { cache: 'no-store' }),
        fetch('/api/themes', { cache: 'no-store' }),
        fetch('/api/subthemes', { cache: 'no-store' }),
        fetch('/api/standards', { cache: 'no-store' }),
      ]);
      const [p, t, s, d] = await Promise.all([pR.json(), tR.json(), sR.json(), dR.json()]);
      if (!pR.ok) throw new Error(p?.error || 'Failed loading pillars');
      if (!tR.ok) throw new Error(t?.error || 'Failed loading themes');
      if (!sR.ok) throw new Error(s?.error || 'Failed loading sub-themes');
      if (!dR.ok) throw new Error(d?.error || 'Failed loading standards');
      setPillars(p); setThemes(t); setSubs(s); setStds(d);
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  // lookups
  const themesByPillar = useMemo(() => {
    const m = new Map<string, Theme[]>();
    for (const t of themes) {
      m.set(t.pillar_id, [...(m.get(t.pillar_id) || []), t]);
    }
    // sort by sort_order then code
    for (const [k, arr] of m) {
      arr.sort(soThenCode);
    }
    return m;
  }, [themes]);

  const subsByTheme = useMemo(() => {
    const m = new Map<string, Subtheme[]>();
    for (const s of subs) {
      m.set(s.theme_id, [...(m.get(s.theme_id) || []), s]);
    }
    for (const [k, arr] of m) arr.sort(soThenCode);
    return m;
  }, [subs]);

  const stdsBySub = useMemo(() => {
    const m = new Map<string, Standard[]>();
    for (const d of stds) {
      m.set(d.subtheme_id, [...(m.get(d.subtheme_id) || []), d]);
    }
    for (const [k, arr] of m) arr.sort((a,b)=> so(a.sort_order)-so(b.sort_order) || (a.code||'').localeCompare(b.code||''));
    return m;
  }, [stds]);

  return (
    <main style={{ padding: 24, maxWidth: 980, margin: '0 auto' }}>
      <div style={{ display:'flex', gap: 12, alignItems:'center', marginBottom: 10 }}>
        <Link href="/" style={{ textDecoration:'none' }}>← Back to Home</Link>
        <Link href="/browse-table" style={{ textDecoration:'none' }}>View read-only table →</Link>
      </div>

      <h1>Framework Editor</h1>
      <p style={{ opacity: 0.8 }}>
        Each level now uses a <b>Description</b> field (no more “Statement”). Changes save via API.
      </p>

      {err && <p style={{ color: 'crimson' }}>{err}</p>}
      {loading && <p>Loading…</p>}

      <section style={{ marginTop: 16 }}>
        <h2 style={{ marginBottom: 8 }}>Add items</h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap: 14 }}>
          <AddPillar onDone={loadAll} />
          {!!pillars.length && <AddTheme pillars={pillars} onDone={loadAll} />}
          {!!themes.length && <AddSubtheme pillars={pillars} themes={themes} onDone={loadAll} />}
          {!!subs.length && <AddStandard pillars={pillars} themes={themes} subs={subs} onDone={loadAll} />}
        </div>
      </section>

      <hr style={{ margin: '24px 0' }} />

      <section>
        <h2 style={{ marginBottom: 8 }}>Edit existing</h2>
        {pillars.sort(soThenCode).map((p) => (
          <div key={p.id} style={{ border:'1px solid #eee', borderRadius: 10, padding: 12, marginBottom: 12 }}>
            <EditPillar item={p} onDone={loadAll} />
            <div style={{ paddingLeft: 14, marginTop: 8 }}>
              {(themesByPillar.get(p.id) || []).map((t) => (
                <div key={t.id} style={{ border:'1px solid #f2f2f2', borderRadius: 8, padding: 10, margin: '8px 0' }}>
                  <EditTheme item={t} onDone={loadAll} />
                  <div style={{ paddingLeft: 12, marginTop: 6 }}>
                    {(subsByTheme.get(t.id) || []).map((s) => (
                      <div key={s.id} style={{ border:'1px dashed #eaeaea', borderRadius: 8, padding: 10, margin: '8px 0' }}>
                        <EditSubtheme item={s} onDone={loadAll} />
                        <div style={{ paddingLeft: 10, marginTop: 6 }}>
                          {(stdsBySub.get(s.id) || []).map((d) => (
                            <div key={d.id} style={{ padding: '8px 0', borderBottom: '1px solid #fafafa' }}>
                              <EditStandard item={d} onDone={loadAll} />
                            </div>
                          ))}
                          {!(stdsBySub.get(s.id) || []).length && (
                            <p style={{ opacity: 0.7, fontStyle:'italic' }}>No standards yet.</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {!(subsByTheme.get(t.id) || []).length && (
                      <p style={{ opacity: 0.7, fontStyle:'italic' }}>No sub-themes yet.</p>
                    )}
                  </div>
                </div>
              ))}
              {!(themesByPillar.get(p.id) || []).length && (
                <p style={{ opacity: 0.7, fontStyle:'italic' }}>No themes yet.</p>
              )}
            </div>
          </div>
        ))}
        {!pillars.length && !loading && <p>No pillars yet.</p>}
      </section>
    </main>
  );
}

/* ---------- Add forms ---------- */

function AddPillar({ onDone }: { onDone: () => void }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); // CHANGED label
  const [sortOrder, setSortOrder] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(null);
    try {
      setSaving(true);
      const res = await fetch('/api/pillars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          name,
          description,            // CHANGED
          sort_order: sortOrder ? Number(sortOrder) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to add pillar');
      setCode(''); setName(''); setDescription(''); setSortOrder('');
      onDone();
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={box()}>
      <h3>Add Pillar</h3>
      <Row>
        <Input label="Code" value={code} onChange={setCode} required />
        <Input label="Name" value={name} onChange={setName} required />
        <NumberInput label="Sort order" value={sortOrder} onChange={setSortOrder} />
      </Row>
      <Row>
        <Textarea label="Description" value={description} onChange={setDescription} placeholder="Describe this pillar…" />
      </Row>
      {err && <ErrorMsg>{err}</ErrorMsg>}
      <button disabled={saving}>{saving ? 'Saving…' : 'Add Pillar'}</button>
    </form>
  );
}

function AddTheme({ pillars, onDone }: { pillars: Pillar[]; onDone: () => void }) {
  const [pillarId, setPillarId] = useState(pillars[0]?.id || '');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); // CHANGED label
  const [sortOrder, setSortOrder] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!pillarId && pillars.length) setPillarId(pillars[0].id);
  }, [pillars, pillarId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(null);
    try {
      setSaving(true);
      const res = await fetch('/api/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pillar_id: pillarId,
          code,
          name,
          description,          // CHANGED
          sort_order: sortOrder ? Number(sortOrder) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to add theme');
      setCode(''); setName(''); setDescription(''); setSortOrder('');
      onDone();
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={box()}>
      <h3>Add Theme</h3>
      <Row>
        <Select label="Pillar" value={pillarId} onChange={setPillarId} options={pillars.map(p=>({value:p.id,label:`${p.code} — ${p.name}`}))} />
        <Input label="Code" value={code} onChange={setCode} required />
        <Input label="Name" value={name} onChange={setName} required />
        <NumberInput label="Sort order" value={sortOrder} onChange={setSortOrder} />
      </Row>
      <Row>
        <Textarea label="Description" value={description} onChange={setDescription} placeholder="Describe this theme…" />
      </Row>
      {err && <ErrorMsg>{err}</ErrorMsg>}
      <button disabled={saving}>{saving ? 'Saving…' : 'Add Theme'}</button>
    </form>
  );
}

function AddSubtheme({ pillars, themes, onDone }: { pillars: Pillar[]; themes: Theme[]; onDone: () => void }) {
  // Dependent selects (pick pillar first to narrow themes)
  const [pillarId, setPillarId] = useState(pillars[0]?.id || '');
  const filteredThemes = useMemo(() => themes.filter(t => t.pillar_id === pillarId), [themes, pillarId]);
  const [themeId, setThemeId] = useState(filteredThemes[0]?.id || '');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); // CHANGED label
  const [sortOrder, setSortOrder] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!pillarId && pillars.length) setPillarId(pillars[0].id);
  }, [pillars, pillarId]);

  useEffect(() => {
    if (!themeId && filteredThemes.length) setThemeId(filteredThemes[0].id);
  }, [filteredThemes, themeId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(null);
    try {
      setSaving(true);
      const res = await fetch('/api/subthemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme_id: themeId,
          code,
          name,
          description,             // CHANGED
          sort_order: sortOrder ? Number(sortOrder) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to add sub-theme');
      setCode(''); setName(''); setDescription(''); setSortOrder('');
      onDone();
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={box()}>
      <h3>Add Sub-theme</h3>
      <Row>
        <Select label="Pillar" value={pillarId} onChange={setPillarId} options={pillars.map(p=>({value:p.id,label:`${p.code} — ${p.name}`}))} />
        <Select label="Theme" value={themeId} onChange={setThemeId} options={filteredThemes.map(t=>({value:t.id,label:`${t.code} — ${t.name}`}))} />
        <Input label="Code" value={code} onChange={setCode} required />
      </Row>
      <Row>
        <Input label="Name" value={name} onChange={setName} required />
        <NumberInput label="Sort order" value={sortOrder} onChange={setSortOrder} />
      </Row>
      <Row>
        <Textarea label="Description" value={description} onChange={setDescription} placeholder="Describe this sub-theme…" />
      </Row>
      {err && <ErrorMsg>{err}</ErrorMsg>}
      <button disabled={saving}>{saving ? 'Saving…' : 'Add Sub-theme'}</button>
    </form>
  );
}

function AddStandard({ pillars, themes, subs, onDone }: {
  pillars: Pillar[]; themes: Theme[]; subs: Subtheme[]; onDone: () => void;
}) {
  const [pillarId, setPillarId] = useState(pillars[0]?.id || '');
  const filteredThemes = useMemo(() => themes.filter(t => t.pillar_id === pillarId), [themes, pillarId]);
  const [themeId, setThemeId] = useState(filteredThemes[0]?.id || '');
  const filteredSubs = useMemo(() => subs.filter(s => s.theme_id === themeId), [subs, themeId]);
  const [subId, setSubId] = useState(filteredSubs[0]?.id || '');

  const [code, setCode] = useState('');
  const [description, setDescription] = useState(''); // CHANGED label
  const [notes, setNotes] = useState('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!pillarId && pillars.length) setPillarId(pillars[0].id);
  }, [pillars, pillarId]);
  useEffect(() => {
    if (!themeId && filteredThemes.length) setThemeId(filteredThemes[0].id);
  }, [filteredThemes, themeId]);
  useEffect(() => {
    if (!subId && filteredSubs.length) setSubId(filteredSubs[0].id);
  }, [filteredSubs, subId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(null);
    try {
      setSaving(true);
      const res = await fetch('/api/standards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subtheme_id: subId,
          code: code || null,
          description,               // CHANGED
          notes: notes || null,
          sort_order: sortOrder ? Number(sortOrder) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to add standard');
      setCode(''); setDescription(''); setNotes(''); setSortOrder('');
      onDone();
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={box()}>
      <h3>Add Standard</h3>
      <Row>
        <Select label="Pillar" value={pillarId} onChange={setPillarId} options={pillars.map(p=>({value:p.id,label:`${p.code} — ${p.name}`}))} />
        <Select label="Theme" value={themeId} onChange={setThemeId} options={filteredThemes.map(t=>({value:t.id,label:`${t.code} — ${t.name}`}))} />
        <Select label="Sub-theme" value={subId} onChange={setSubId} options={filteredSubs.map(s=>({value:s.id,label:`${s.code} — ${s.name}`}))} />
      </Row>
      <Row>
        <Input label="Code (optional)" value={code} onChange={setCode} />
        <NumberInput label="Sort order" value={sortOrder} onChange={setSortOrder} />
      </Row>
      <Row>
        <Textarea label="Description" value={description} onChange={setDescription} placeholder="Describe this standard…" required />
      </Row>
      <Row>
        <Textarea label="Notes (optional)" value={notes} onChange={setNotes} placeholder="Notes, guidance, edge cases…" />
      </Row>
      {err && <ErrorMsg>{err}</ErrorMsg>}
      <button disabled={saving}>{saving ? 'Saving…' : 'Add Standard'}</button>
    </form>
  );
}

/* ---------- Edit forms ---------- */

function EditPillar({ item, onDone }: { item: Pillar; onDone: () => void }) {
  const [code, setCode] = useState(item.code || '');
  const [name, setName] = useState(item.name || '');
  const [description, setDescription] = useState(item.description || ''); // CHANGED label
  const [sortOrder, setSortOrder] = useState(String(item.sort_order ?? ''));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setErr(null);
    try {
      setSaving(true);
      const res = await fetch(`/api/pillars/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          name,
          description,              // CHANGED
          sort_order: sortOrder ? Number(sortOrder) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed updating pillar');
      onDone();
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  async function del() {
    if (!confirm('Delete this pillar (and its children)?')) return;
    const res = await fetch(`/api/pillars/${item.id}`, { method: 'DELETE' });
    if (!res.ok) alert('Failed to delete pillar'); else onDone();
  }

  return (
    <div>
      <h3 style={{ margin: 0 }}>{item.code} — {item.name}</h3>
      <Row>
        <Input label="Code" value={code} onChange={setCode} />
        <Input label="Name" value={name} onChange={setName} />
        <NumberInput label="Sort order" value={sortOrder} onChange={setSortOrder} />
      </Row>
      <Row>
        <Textarea label="Description" value={description} onChange={setDescription} />
      </Row>
      {err && <ErrorMsg>{err}</ErrorMsg>}
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Pillar'}</button>
        <button onClick={del} style={{ color: 'crimson' }}>Delete</button>
      </div>
    </div>
  );
}

function EditTheme({ item, onDone }: { item: Theme; onDone: () => void }) {
  const [code, setCode] = useState(item.code || '');
  const [name, setName] = useState(item.name || '');
  const [description, setDescription] = useState(item.description || ''); // CHANGED label
  const [sortOrder, setSortOrder] = useState(String(item.sort_order ?? ''));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setErr(null);
    try {
      setSaving(true);
      const res = await fetch(`/api/themes/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          name,
          description,             // CHANGED
          sort_order: sortOrder ? Number(sortOrder) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed updating theme');
      onDone();
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  async function del() {
    if (!confirm('Delete this theme (and its children)?')) return;
    const res = await fetch(`/api/themes/${item.id}`, { method: 'DELETE' });
    if (!res.ok) alert('Failed to delete theme'); else onDone();
  }

  return (
    <div>
      <strong>{item.code} — {item.name}</strong>
      <Row>
        <Input label="Code" value={code} onChange={setCode} />
        <Input label="Name" value={name} onChange={setName} />
        <NumberInput label="Sort order" value={sortOrder} onChange={setSortOrder} />
      </Row>
      <Row>
        <Textarea label="Description" value={description} onChange={setDescription} />
      </Row>
      {err && <ErrorMsg>{err}</ErrorMsg>}
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Theme'}</button>
        <button onClick={del} style={{ color: 'crimson' }}>Delete</button>
      </div>
    </div>
  );
}

function EditSubtheme({ item, onDone }: { item: Subtheme; onDone: () => void }) {
  const [code, setCode] = useState(item.code || '');
  const [name, setName] = useState(item.name || '');
  const [description, setDescription] = useState(item.description || ''); // CHANGED label
  const [sortOrder, setSortOrder] = useState(String(item.sort_order ?? ''));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setErr(null);
    try {
      setSaving(true);
      const res = await fetch(`/api/subthemes/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          name,
          description,             // CHANGED
          sort_order: sortOrder ? Number(sortOrder) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed updating sub-theme');
      onDone();
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  async function del() {
    if (!confirm('Delete this sub-theme (and its standards)?')) return;
    const res = await fetch(`/api/subthemes/${item.id}`, { method: 'DELETE' });
    if (!res.ok) alert('Failed to delete sub-theme'); else onDone();
  }

  return (
    <div>
      <em>{item.code} — {item.name}</em>
      <Row>
        <Input label="Code" value={code} onChange={setCode} />
        <Input label="Name" value={name} onChange={setName} />
        <NumberInput label="Sort order" value={sortOrder} onChange={setSortOrder} />
      </Row>
      <Row>
        <Textarea label="Description" value={description} onChange={setDescription} />
      </Row>
      {err && <ErrorMsg>{err}</ErrorMsg>}
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Sub-theme'}</button>
        <button onClick={del} style={{ color: 'crimson' }}>Delete</button>
      </div>
    </div>
  );
}

function EditStandard({ item, onDone }: { item: Standard; onDone: () => void }) {
  const [code, setCode] = useState(item.code || '');
  const [description, setDescription] = useState(item.description || ''); // CHANGED label
  const [notes, setNotes] = useState(item.notes || '');
  const [sortOrder, setSortOrder] = useState(String(item.sort_order ?? ''));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setErr(null);
    try {
      setSaving(true);
      const res = await fetch(`/api/standards/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code || null,
          description,             // CHANGED
          notes: notes || null,
          sort_order: sortOrder ? Number(sortOrder) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed updating standard');
      onDone();
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  async function del() {
    if (!confirm('Delete this standard?')) return;
    const res = await fetch(`/api/standards/${item.id}`, { method: 'DELETE' });
    if (!res.ok) alert('Failed to delete standard'); else onDone();
  }

  return (
    <div>
      <Row>
        <Input label="Code (optional)" value={code} onChange={setCode} />
        <NumberInput label="Sort order" value={sortOrder} onChange={setSortOrder} />
      </Row>
      <Row>
        <Textarea label="Description" value={description} onChange={setDescription} />
      </Row>
      <Row>
        <Textarea label="Notes (optional)" value={notes} onChange={setNotes} />
      </Row>
      {err && <ErrorMsg>{err}</ErrorMsg>}
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Standard'}</button>
        <button onClick={del} style={{ color: 'crimson' }}>Delete</button>
      </div>
    </div>
  );
}

/* ---------- tiny UI helpers ---------- */

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: 10, margin: '8px 0' }}>{children}</div>;
}
function Input({ label, value, onChange, required }: { label:string; value:string; onChange:(v:string)=>void; required?:boolean }) {
  return (
    <label style={{ display:'grid', gap:6 }}>
      <span>{label}{required ? ' *' : ''}</span>
      <input value={value} onChange={e=>onChange(e.target.value)} required={required}
             style={{ padding:'10px 12px', border:'1px solid #ddd', borderRadius:8 }} />
    </label>
  );
}
function NumberInput({ label, value, onChange }: { label:string; value:string; onChange:(v:string)=>void }) {
  return (
    <label style={{ display:'grid', gap:6 }}>
      <span>{label}</span>
      <input inputMode="numeric" pattern="[0-9]*" value={value} onChange={e=>onChange(e.target.value)}
             style={{ padding:'10px 12px', border:'1px solid #ddd', borderRadius:8 }} />
    </label>
  );
}
function Textarea({ label, value, onChange, placeholder, required }: { label:string; value:string; onChange:(v:string)=>void; placeholder?:string; required?:boolean }) {
  return (
    <label style={{ display:'grid', gap:6 }}>
      <span>{label}{required ? ' *' : ''}</span>
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
                rows={3} style={{ padding:'10px 12px', border:'1px solid #ddd', borderRadius:8 }} />
    </label>
  );
}
function Select({ label, value, onChange, options }:{ label:string; value:string; onChange:(v:string)=>void; options:{value:string,label:string}[] }) {
  return (
    <label style={{ display:'grid', gap:6 }}>
      <span>{label}</span>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{ padding:'10px 12px', border:'1px solid #ddd', borderRadius:8 }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
function ErrorMsg({ children }: { children: React.ReactNode }) {
  return <p style={{ color:'crimson', margin:'6px 0' }}>{children}</p>;
}
function box() { return { border:'1px solid #eee', borderRadius:10, padding:12 }; }

function so(n: number|null|undefined) { return n ?? 999999; }
function soThenCode<T extends { sort_order: number|null; code: string }>(a:T,b:T) {
  return so(a.sort_order) - so(b.sort_order) || a.code.localeCompare(b.code);
}
