'use client';

import { useEffect, useState } from 'react';
import { getFrameworkTree, addPillar, addTheme, addSubtheme } from '@/lib/hooks/useFramework';
import { withRefCodes } from '@/lib/refCodes';
import type { FrameworkTree, Pillar, Theme } from '@/types/framework';

export default function FrameworkEditor() {
  const [tree, setTree] = useState<FrameworkTree>({ pillars: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const raw = await getFrameworkTree();
      setTree(withRefCodes(raw));
    } catch (e: any) {
      setError(e.message ?? 'Failed to load framework');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  return (
    <div className="space-y-4">
      {loading && <div className="text-sm text-gray-500">Loading framework…</div>}
      {error && <div className="text-sm text-red-600">Error: {error}</div>}

      <div className="flex items-center gap-2">
        <AddPillarForm onAdded={refresh} />
      </div>

      <div className="space-y-3">
        {tree.pillars.map((pillar) => (
          <PillarCard key={pillar.id} pillar={pillar} onChanged={refresh} />
        ))}
      </div>
    </div>
  );
}

function PillarCard({ pillar, onChanged }: { pillar: Pillar; onChanged: () => void }) {
  return (
    <div className="rounded-xl border p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{pillar.ref_code} — {pillar.name}</div>
          {pillar.description && <div className="text-sm text-gray-600">{pillar.description}</div>}
        </div>
        <AddThemeForm pillarId={pillar.id} onAdded={onChanged} />
      </div>
      <div className="mt-3 space-y-2">
        {(pillar.themes ?? []).map((theme) => (
          <ThemeRow key={theme.id} theme={theme} pillarCode={pillar.ref_code ?? ''} onChanged={onChanged} />
        ))}
      </div>
    </div>
  );
}

function ThemeRow({ theme, pillarCode, onChanged }: { theme: Theme; pillarCode: string; onChanged: () => void }) {
  return (
    <div className="rounded-lg border p-3 bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{theme.ref_code} — {theme.name}</div>
          {theme.description && <div className="text-sm text-gray-600">{theme.description}</div>}
        </div>
        <AddSubthemeForm themeId={theme.id} onAdded={onChanged} />
      </div>
      <ul className="mt-2 list-disc pl-6 text-sm">
        {(theme.subthemes ?? []).map((s) => (
          <li key={s.id}><span className="font-medium">{s.ref_code}</span> — {s.name}</li>
        ))}
      </ul>
    </div>
  );
}

function AddPillarForm({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      await addPillar({ name, description });
      setOpen(false); setName(''); setDescription('');
      onAdded();
    } catch (e: any) {
      alert(e.message ?? 'Failed to add pillar');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {!open ? (
        <button className="px-3 py-1.5 rounded-md bg-black text-white" onClick={() => setOpen(true)}>
          + Add Pillar
        </button>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <input className="border rounded px-2 py-1" placeholder="Pillar name" value={name} onChange={e => setName(e.target.value)} />
          <input className="border rounded px-2 py-1 min-w-[240px]" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
          <button className="px-3 py-1.5 rounded-md bg-black text-white disabled:opacity-50" disabled={busy || !name.trim()} onClick={submit}>
            Save
          </button>
          <button className="px-3 py-1.5 rounded-md border" onClick={() => setOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

function AddThemeForm({ pillarId, onAdded }: { pillarId: string; onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      await addTheme(pillarId, { name, description });
      setOpen(false); setName(''); setDescription('');
      onAdded();
    } catch (e: any) {
      alert(e.message ?? 'Failed to add theme');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {!open ? (
        <button className="px-2 py-1 rounded border">+ Theme</button>
      ) : null}
      <div className="inline-flex items-center gap-2">
        <button className="px-2 py-1 rounded border" onClick={() => setOpen((v) => !v)}>{open ? 'Close' : '+ Theme'}</button>
        {open && (
          <>
            <input className="border rounded px-2 py-1" placeholder="Theme name" value={name} onChange={e => setName(e.target.value)} />
            <input className="border rounded px-2 py-1 min-w-[200px]" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
            <button className="px-2 py-1 rounded bg-black text-white disabled:opacity-50" disabled={busy || !name.trim()} onClick={submit}>
              Save
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function AddSubthemeForm({ themeId, onAdded }: { themeId: string; onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      await addSubtheme(themeId, { name, description });
      setOpen(false); setName(''); setDescription('');
      onAdded();
    } catch (e: any) {
      alert(e.message ?? 'Failed to add subtheme');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      <button className="px-2 py-1 rounded border" onClick={() => setOpen((v) => !v)}>{open ? 'Close' : '+ Subtheme'}</button>
      {open && (
        <>
          <input className="border rounded px-2 py-1" placeholder="Subtheme name" value={name} onChange={e => setName(e.target.value)} />
          <input className="border rounded px-2 py-1 min-w-[200px]" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
          <button className="px-2 py-1 rounded bg-black text-white disabled:opacity-50" disabled={busy || !name.trim()} onClick={submit}>
            Save
          </button>
        </>
      )}
    </div>
  );
}
