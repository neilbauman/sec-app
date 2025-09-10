// /components/PrimaryFrameworkCards.tsx
'use client';

import { useMemo, useState, useTransition } from 'react';
import type { Pillar, Theme, Subtheme } from '@/types/framework';

type Entity = 'pillar' | 'theme' | 'subtheme';

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  actions: {
    updateName: (entity: Entity, code: string, name: string) => Promise<void>;
    updateDescription: (entity: Entity, code: string, description: string) => Promise<void>;
    updateSort: (entity: Entity, code: string, sort: number) => Promise<void>;
    bumpSort: (entity: Entity, code: string, delta: number) => Promise<void>;
  };
};

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions,
}: Props) {
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  // Ensure default collapsed unless user toggles
  const isPillarOpen = (code: string) => openPillars[code] ?? defaultOpen;
  const isThemeOpen = (code: string) => openThemes[code] ?? defaultOpen;

  const byPillar: Record<string, Theme[]> = useMemo(() => {
    const m: Record<string, Theme[]> = {};
    for (const t of themes) {
      (m[t.pillar_code] ??= []).push(t);
    }
    return m;
  }, [themes]);

  const subsByTheme: Record<string, Subtheme[]> = useMemo(() => {
    const m: Record<string, Subtheme[]> = {};
    for (const s of subthemes) {
      (m[s.theme_code] ??= []).push(s);
    }
    return m;
  }, [subthemes]);

  return (
    <div className="rounded-xl border bg-white">
      {/* Header row */}
      <div className="grid grid-cols-[1fr_120px_160px] items-center border-b bg-slate-50 px-4 py-3 text-xs font-medium text-slate-600">
        <div>Name & description</div>
        <div className="text-center">Sort order</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Pillars */}
      {pillars.map((p) => {
        const open = isPillarOpen(p.code);
        const pillarThemes = byPillar[p.pillar_code ?? p.code] ?? [];
        return (
          <div key={p.code} className="border-b">
            <Row
              level="pillar"
              open={open}
              onToggle={() => setOpenPillars((s) => ({ ...s, [p.code]: !open }))}
              code={p.code}
              name={p.name}
              description={p.description ?? ''}
              sort={p.sort_order}
              tagColor="blue"
              actions={actions}
            />

            {open && (
              <div>
                {pillarThemes.map((t) => {
                  const tOpen = isThemeOpen(t.code);
                  const themeSubs = subsByTheme[t.code] ?? [];
                  return (
                    <div key={t.code}>
                      <Row
                        level="theme"
                        open={tOpen}
                        onToggle={() => setOpenThemes((s) => ({ ...s, [t.code]: !tOpen }))}
                        code={t.code}
                        name={t.name}
                        description={t.description ?? ''}
                        sort={t.sort_order}
                        tagColor="green"
                        actions={actions}
                      />
                      {tOpen && (
                        <div>
                          {themeSubs.map((s) => (
                            <Row
                              key={s.code}
                              level="subtheme"
                              open={false}
                              onToggle={undefined}
                              code={s.code}
                              name={s.name}
                              description={s.description ?? ''}
                              sort={s.sort_order}
                              tagColor="red"
                              actions={actions}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {isPending && (
        <div className="px-4 py-3 text-xs text-slate-500">Saving…</div>
      )}
    </div>
  );
}

function Row({
  level,
  open,
  onToggle,
  code,
  name,
  description,
  sort,
  tagColor,
  actions,
}: {
  level: 'pillar' | 'theme' | 'subtheme';
  open: boolean;
  onToggle?: () => void;
  code: string;
  name: string;
  description: string;
  sort: number;
  tagColor: 'blue' | 'green' | 'red';
  actions: Props['actions'];
}) {
  const [isPending, startTransition] = useTransition();
  const [localName, setLocalName] = useState(name);
  const [localDesc, setLocalDesc] = useState(description ?? '');
  const [localSort, setLocalSort] = useState<number>(sort);

  const indent =
    level === 'pillar' ? 'pl-0' : level === 'theme' ? 'pl-6' : 'pl-12';
  const tagStyles =
    tagColor === 'blue'
      ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-200'
      : tagColor === 'green'
      ? 'bg-green-100 text-green-800 ring-1 ring-green-200'
      : 'bg-red-100 text-red-800 ring-1 ring-red-200';

  return (
    <div className="grid grid-cols-[1fr_120px_160px] items-start gap-3 px-4 py-3">
      {/* Name & description */}
      <div className={indent}>
        <div className="flex items-center gap-2">
          {/* caret */}
          {onToggle ? (
            <button
              onClick={onToggle}
              className="rounded p-1 text-slate-500 hover:bg-slate-100"
              aria-label={open ? 'Collapse' : 'Expand'}
            >
              {open ? '▾' : '▸'}
            </button>
          ) : (
            <span className="inline-block w-4" />
          )}

          {/* tag + code + name */}
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium ${tagStyles}`}
          >
            {level === 'pillar' ? 'Pillar' : level === 'theme' ? 'Theme' : 'Subtheme'}
          </span>

          <span className="text-[10px] font-semibold text-slate-400 ml-1">{code}</span>

          <input
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            onBlur={() =>
              startTransition(() => actions.updateName(level, code, localName.trim()))
            }
            className="ml-2 w-full max-w-xl rounded border px-2 py-1 text-sm"
          />
        </div>

        <textarea
          value={localDesc}
          onChange={(e) => setLocalDesc(e.target.value)}
          onBlur={() =>
            startTransition(() => actions.updateDescription(level, code, localDesc))
          }
          placeholder="Description…"
          className="mt-2 w-full max-w-2xl rounded border px-2 py-1 text-[13px] text-slate-700"
          rows={2}
        />
      </div>

      {/* Sort order */}
      <div className="flex items-center justify-center gap-2">
        <button
          className="rounded border px-2 py-1 text-xs hover:bg-slate-50"
          title="Move up"
          onClick={() => startTransition(() => actions.bumpSort(level, code, -1))}
        >
          ↑
        </button>
        <input
          type="number"
          value={localSort}
          onChange={(e) => setLocalSort(Number(e.target.value))}
          onBlur={() =>
            startTransition(() => actions.updateSort(level, code, Number(localSort)))
          }
          className="w-16 rounded border px-2 py-1 text-sm text-center"
        />
        <button
          className="rounded border px-2 py-1 text-xs hover:bg-slate-50"
          title="Move down"
          onClick={() => startTransition(() => actions.bumpSort(level, code, +1))}
        >
          ↓
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-start justify-end gap-2">
        <button className="cursor-not-allowed rounded border px-2 py-1 text-xs text-slate-400" title="Coming soon" disabled>
          Add
        </button>
        <button className="cursor-not-allowed rounded border px-2 py-1 text-xs text-slate-400" title="Coming soon" disabled>
          Delete
        </button>
      </div>

      {isPending && (
        <div className="col-span-3 pl-6 text-[10px] text-slate-400">Saving…</div>
      )}
    </div>
  );
}
