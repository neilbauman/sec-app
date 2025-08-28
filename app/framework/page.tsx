// app/framework/page.tsx
'use client';
import { useEffect, useMemo, useState } from 'react';

type Pillar = {
  id: string; code: string; name: string;
  statement?: string | null; description?: string | null;
  sort_order: number | null;
};
type Theme = {
  id: string; pillar_id: string; code: string; name: string;
  statement?: string | null; description?: string | null;
  sort_order: number | null;
};

export default function FrameworkPage() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    const [pillarsRes, themesRes] = await Promise.all([
      fetch('/api/pillars', { cache: 'no-store' }),
      fetch('/api/themes', { cache: 'no-store' }),
    ]);
    const [pillarsData, themesData] = await Promise.all([pillarsRes.json(), themesRes.json()]);
    if (!pillarsRes.ok) setErr(pillarsData?.error || 'Failed to load pillars');
    if (!themesRes.ok) setErr(themesData?.error || 'Failed to load themes');
    if (pillarsRes.ok) setPillars(pillarsData);
    if (themesRes.ok) setThemes(themesData);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const themesByPillar = useMemo(() => {
    const m: Record<string, Theme[]> = {};
    for (const t of themes) (m[t.pillar_id] ||= []).push(t);
    return m;
  }, [themes]);

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <h1>SSC Framework — Pillars & Themes</h1>
      <p style={{ opacity: 0.8 }}>Changes save live. Add Pillars first, then Themes inside each Pillar.</p>

      <AddPillar onDone={load} />

      {loading && <p>Loading…</p>}
      {err && <p style={{ color: 'crimson' }}>{err}</p>}

      <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        {pillars.map(p => (
          <details key={p.id} open>
            <summary><b>{p.code}</b> — {p.name}</summary>
            <PillarCard p={p} onChanged={load} onDeleted={load} />
            <div style={{ margin: '8px 0 12px 0', paddingLeft: 12, borderLeft: '2px solid #eee' }}>
              <h3 style={{ margin: '8px 0' }}>Themes</h3>
              <AddTheme pillar={p} onDone={load} />
              <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
                {(themesByPillar[p.id] || []).map(t => (
                  <ThemeCard key={t.id} t={t} onChanged={load} onDeleted={load} />
                ))}
                {(themesByPillar[p.id] || []).length === 0 && (
                  <div style={{ opacity: 0.7 }}>No themes yet for {p.code}.</div>
                )}
              </div>
            </div>
          </details>
        ))}
        {!loading && pillars.length === 0 && <p>No pillars yet — add your first one above.</p>}
      </div>
    </main>
  );
}

/* ---------------- Pillars ------------------ */

function AddPillar({ onDone }: { onDone: () => void }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [statement, setStatement] = useState('');
  const [description, setDescription] = useState('');
  const [sort, setSort] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMsg(null);
    const res = await fetch('/api/pillars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code.trim(),
        name: name.trim(),
        statement: statement.trim() || null,
        description: description.trim() || null,
        sort_order: sort === '' ? 1 : Number(sort),
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) setMsg(data?.error || 'Failed to save');
    else { setCode(''); setName(''); setStatement(''); setDescription(''); setSort(''); onDone(); }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8, padding: 12, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2 style={{ margin: 0 }}>Add Pillar</h2>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 2fr' }}>
        <label>Code (e.g. P1)</label><input value={code} onChange={e => setCode(e.target.value)} required />
        <label>Name</label><input value={name} onChange={e => setName(e.target.value)} required />
        <label>Statement</label><input value={statement} onChange={e => setStatement(e.target.value)} placeholder="Narrative / standard" />
        <label>Description</label><input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional" />
        <label>Sort Order</label><input type="number" value={sort} onChange={e => setSort(e.target.value === '' ? '' : Number(e.target.value))} placeholder="1" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add Pillar'}</button>
        {msg && <span style={{ color: 'crimson' }}>{msg}</span>}
      </div>
    </form>
  );
}

function PillarCard({ p, onChanged, onDeleted }: { p: Pillar; onChanged: () => void; onDeleted: () => void }) {
  const [edit, setEdit] = useState(false);
  const [code, setCode] = useState(p.code);
  const [name, setName] = useState(p.name);
  const [statement, setStatement] = useState(p.statement || '');
  const [description, setDescription] = useState(p.description || '');
  const [sort, setSort] = useState<number | ''>(p.sort_order ?? 1);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setSaving(true); setMsg(null);
    const res = await fetch(`/api/pillars/${p.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code.trim(), name: name.trim(),
        statement: statement.trim() || null,
        description: description.trim() || null,
        sort_order: sort === '' ? 1 : Number(sort),
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) setMsg(data?.error || 'Failed to update');
    else { setEdit(false); onChanged(); }
  }

  async function del() {
    if (!confirm(`Delete pillar ${p.code}?`)) return;
    const res = await fetch(`/api/pillars/${p.id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) alert(data?.error || 'Delete failed'); else onDeleted();
  }

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, marginTop: 8 }}>
      {!edit ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <b>{p.code}</b>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setEdit(true)}>Edit</button>
              <button onClick={del}>Delete</button>
            </div>
          </div>
          <div style={{ opacity: 0.9 }}>{p.name}</div>
          {p.statement && <div style={{ marginTop: 6 }}><i>{p.statement}</i></div>}
          {p.description && <div style={{ marginTop: 6 }}>{p.description}</div>}
          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>Sort: {p.sort_order ?? 1}</div>
        </>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 2fr' }}>
            <label>Code</label><input value={code} onChange={e => setCode(e.target.value)} required />
            <label>Name</label><input value={name} onChange={e => setName(e.target.value)} required />
            <label>Statement</label><input value={statement} onChange={e => setStatement(e.target.value)} />
            <label>Description</label><input value={description} onChange={e => setDescription(e.target.value)} />
            <label>Sort</label><input type="number" value={sort} onChange={e => setSort(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button onClick={() => setEdit(false)} disabled={saving}>Cancel</button>
            {msg && <span style={{ color: 'crimson' }}>{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Themes ------------------ */

function AddTheme({ pillar, onDone }: { pillar: Pillar; onDone: () => void }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [statement, setStatement] = useState('');
  const [description, setDescription] = useState('');
  const [sort, setSort] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setMsg(null);
    const res = await fetch('/api/themes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pillar_id: pillar.id,
        code: code.trim(), name: name.trim(),
        statement: statement.trim() || null,
        description: description.trim() || null,
        sort_order: sort === '' ? 1 : Number(sort),
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) setMsg(data?.error || 'Failed to save');
    else { setCode(''); setName(''); setStatement(''); setDescription(''); setSort(''); onDone(); }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8, padding: 10, border: '1px dashed #ddd', borderRadius: 8, background:'#fafafa' }}>
      <b>Add Theme to {pillar.code}</b>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 2fr' }}>
        <label>Code (e.g. T1.1)</label><input value={code} onChange={e => setCode(e.target.value)} required />
        <label>Name</label><input value={name} onChange={e => setName(e.target.value)} required />
        <label>Statement</label><input value={statement} onChange={e => setStatement(e.target.value)} placeholder="Narrative / standard" />
        <label>Description</label><input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional" />
        <label>Sort</label><input type="number" value={sort} onChange={e => setSort(e.target.value === '' ? '' : Number(e.target.value))} placeholder="1" />
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add Theme'}</button>
        {msg && <span style={{ color:'crimson' }}>{msg}</span>}
      </div>
    </form>
  );
}

function ThemeCard({ t, onChanged, onDeleted }: { t: Theme; onChanged: () => void; onDeleted: () => void }) {
  const [edit, setEdit] = useState(false);
  const [code, setCode] = useState(t.code);
  const [name, setName] = useState(t.name);
  const [statement, setStatement] = useState(t.statement || '');
  const [description, setDescription] = useState(t.description || '');
  const [sort, setSort] = useState<number | ''>(t.sort_order ?? 1);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setSaving(true); setMsg(null);
    const res = await fetch(`/api/themes/${t.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code.trim(), name: name.trim(),
        statement: statement.trim() || null,
        description: description.trim() || null,
        sort_order: sort === '' ? 1 : Number(sort),
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) setMsg(data?.error || 'Failed to update');
    else { setEdit(false); onChanged(); }
  }

  async function del() {
    if (!confirm(`Delete theme ${t.code}?`)) return;
    const res = await fetch(`/api/themes/${t.id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) alert(data?.error || 'Delete failed'); else onDeleted();
  }

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 10 }}>
      {!edit ? (
        <>
          <div style={{ display:'flex', justifyContent:'space-between', gap:12 }}>
            <b>{t.code}</b>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => setEdit(true)}>Edit</button>
              <button onClick={del}>Delete</button>
            </div>
          </div>
          <div style={{ opacity:0.9 }}>{t.name}</div>
          {t.statement && <div style={{ marginTop:6 }}><i>{t.statement}</i></div>}
          {t.description && <div style={{ marginTop:6 }}>{t.description}</div>}
          <div style={{ marginTop:6, fontSize:12, opacity:0.7 }}>Sort: {t.sort_order ?? 1}</div>
        </>
      ) : (
        <div style={{ display:'grid', gap:8 }}>
          <div style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 2fr' }}>
            <label>Code</label><input value={code} onChange={e => setCode(e.target.value)} required />
            <label>Name</label><input value={name} onChange={e => setName(e.target.value)} required />
            <label>Statement</label><input value={statement} onChange={e => setStatement(e.target.value)} />
            <label>Description</label><input value={description} onChange={e => setDescription(e.target.value)} />
            <label>Sort</label><input type="number" value={sort} onChange={e => setSort(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button onClick={() => setEdit(false)} disabled={saving}>Cancel</button>
            {msg && <span style={{ color:'crimson' }}>{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
