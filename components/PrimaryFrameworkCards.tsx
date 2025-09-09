'use client'; 

import * as React from 'react';

/** ---------- Types passed from server page ---------- */
export type AppRole = 'super-admin' | 'country-admin' | 'public';

type Pillar = {
  code: string;
  name: string;
  description?: string;
  sort_order: number;
};

type Theme = {
  code: string;
  pillar_code: string;
  name: string;
  description?: string;
  sort_order: number;
};

type Subtheme = {
  code: string;
  theme_code: string;
  name: string;
  description?: string;
  sort_order: number;
};

type Props = {
  role: AppRole;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  /** Optional: if true, disable all action buttons regardless of role */
  readOnly?: boolean;
};

/** ---------- Small UI helpers ---------- */
const Tag = ({
  color,
  children,
}: {
  color: 'blue' | 'green' | 'rose';
  children: React.ReactNode;
}) => {
  const palette =
    color === 'blue'
      ? 'bg-blue-50 text-blue-700 ring-blue-200'
      : color === 'green'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : 'bg-rose-50 text-rose-700 ring-rose-200';
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${palette}`}
    >
      {children}
    </span>
  );
};

const CodeBubble = ({ code }: { code: string }) => (
  <span className="ml-2 text-[11px] text-slate-400">[{code}]</span>
);

const SortBadge = ({ n }: { n: number }) => (
  <span className="text-xs text-slate-500">Sort {n}</span>
);

const IconBtn = ({
  title,
  onClick,
  disabled,
  children,
}: {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white`}
  >
    {children}
  </button>
);

/** A light chevron control used for expand/collapse */
const Chevron = ({
  open,
  onToggle,
  title,
}: {
  open: boolean;
  onToggle: () => void;
  title?: string;
}) => (
  <button
    type="button"
    onClick={onToggle}
    title={title || (open ? 'Collapse' : 'Expand')}
    className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
  >
    <span
      className={`inline-block transition-transform ${
        open ? 'rotate-90' : 'rotate-0'
      }`}
    >
      ▶
    </span>
  </button>
);

/** ---------- Main component ---------- */
export default function PrimaryFrameworkCards({
  role,
  pillars,
  themes,
  subthemes,
  readOnly,
}: Props) {
  const canEdit = role === 'super-admin' && !readOnly;

  // Group themes by pillar; subthemes by theme (sorted by sort_order)
  const themesByPillar = React.useMemo(() => {
    const m: Record<string, Theme[]> = {};
    for (const t of themes) {
      (m[t.pillar_code] ??= []).push(t);
    }
    for (const k of Object.keys(m)) m[k].sort((a, b) => a.sort_order - b.sort_order);
    return m;
  }, [themes]);

  const subsByTheme = React.useMemo(() => {
    const m: Record<string, Subtheme[]> = {};
    for (const s of subthemes) {
      (m[s.theme_code] ??= []).push(s);
    }
    for (const k of Object.keys(m)) m[k].sort((a, b) => a.sort_order - b.sort_order);
    return m;
  }, [subthemes]);

  // Collapse state: default collapsed for pillars and themes
  const [pillarOpen, setPillarOpen] = React.useState<Record<string, boolean>>({});
  const [themeOpen, setThemeOpen] = React.useState<Record<string, boolean>>({});

  const togglePillar = (code: string) =>
    setPillarOpen((p) => ({ ...p, [code]: !p[code] }));
  const toggleTheme = (code: string) =>
    setThemeOpen((p) => ({ ...p, [code]: !p[code] }));

  // No-op handlers for now (wire up later to API endpoints)
  const noop = (msg: string) => () => {
    // eslint-disable-next-line no-console
    console.log(`[PrimaryFrameworkCards] ${msg} (no-op for now)`);
  };

  return (
    <div className="space-y-4">
      {/* Tailwind smoke test (can be removed now that styling works) */}
      <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm text-indigo-800">
        Tailwind check: this box should look purple with rounded corners.
      </div>

      {pillars
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((p) => {
          const pOpen = !!pillarOpen[p.code];
          const pThemes = themesByPillar[p.code] ?? [];

          return (
            <section
              key={p.code}
              className="rounded-2xl border border-slate-200 shadow-sm"
            >
              {/* Pillar header row */}
              <div className="flex items-start justify-between gap-3 px-4 py-3">
                <div className="flex min-w-0 items-start">
                  <Chevron
                    open={pOpen}
                    onToggle={() => togglePillar(p.code)}
                    title={pOpen ? 'Collapse pillar' : 'Expand pillar'}
                  />
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <Tag color="blue">Pillar</Tag>
                      <CodeBubble code={p.code} />
                    </div>
                    <h2 className="truncate text-lg font-semibold text-slate-900">
                      {p.name}
                    </h2>
                    {p.description ? (
                      <p className="mt-1 text-sm text-slate-600">{p.description}</p>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <SortBadge n={p.sort_order} />
                  <div className="mx-1 h-5 w-px bg-slate-200" />
                  <IconBtn title="Edit pillar" onClick={noop(`edit pillar ${p.code}`)} disabled={!canEdit}>
                    ✎
                  </IconBtn>
                  <IconBtn title="Move up" onClick={noop(`move up pillar ${p.code}`)} disabled={!canEdit}>
                    ↑
                  </IconBtn>
                  <IconBtn title="Move down" onClick={noop(`move down pillar ${p.code}`)} disabled={!canEdit}>
                    ↓
                  </IconBtn>
                  <IconBtn title="Add theme" onClick={noop(`add theme under ${p.code}`)} disabled={!canEdit}>
                    +
                  </IconBtn>
                  <IconBtn title="Delete pillar" onClick={noop(`delete pillar ${p.code}`)} disabled={!canEdit}>
                    🗑
                  </IconBtn>
                </div>
              </div>

              {/* Themes list */}
              {pOpen && pThemes.length > 0 && (
                <div className="divide-y divide-slate-200 border-t border-slate-200">
                  {pThemes.map((t) => {
                    const tOpen = !!themeOpen[t.code];
                    const tSubs = subsByTheme[t.code] ?? [];
                    return (
                      <div key={t.code} className="px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start">
                            <Chevron
                              open={tOpen}
                              onToggle={() => toggleTheme(t.code)}
                              title={tOpen ? 'Collapse theme' : 'Expand theme'}
                            />
                            <div className="min-w-0">
                              <div className="mb-1 flex items-center gap-2">
                                <Tag color="green">Theme</Tag>
                                <CodeBubble code={t.code} />
                              </div>
                              <h3 className="truncate text-base font-semibold text-slate-900">
                                {t.name}
                              </h3>
                              {t.description ? (
                                <p className="mt-1 text-sm text-slate-600">
                                  {t.description}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <SortBadge n={t.sort_order} />
                            <div className="mx-1 h-5 w-px bg-slate-200" />
                            <IconBtn
                              title="Edit theme"
                              onClick={noop(`edit theme ${t.code}`)}
                              disabled={!canEdit}
                            >
                              ✎
                            </IconBtn>
                            <IconBtn
                              title="Move up"
                              onClick={noop(`move up theme ${t.code}`)}
                              disabled={!canEdit}
                            >
                              ↑
                            </IconBtn>
                            <IconBtn
                              title="Move down"
                              onClick={noop(`move down theme ${t.code}`)}
                              disabled={!canEdit}
                            >
                              ↓
                            </IconBtn>
                            <IconBtn
                              title="Add subtheme"
                              onClick={noop(`add subtheme under ${t.code}`)}
                              disabled={!canEdit}
                            >
                              +
                            </IconBtn>
                            <IconBtn
                              title="Delete theme"
                              onClick={noop(`delete theme ${t.code}`)}
                              disabled={!canEdit}
                            >
                              🗑
                            </IconBtn>
                          </div>
                        </div>

                        {/* Subthemes */}
                        {tOpen && tSubs.length > 0 && (
                          <div className="mt-3 space-y-3 pl-10">
                            {tSubs.map((s) => (
                              <div
                                key={s.code}
                                className="flex items-start justify-between rounded-xl border border-slate-200 px-3 py-2"
                              >
                                <div className="min-w-0">
                                  <div className="mb-1 flex items-center gap-2">
                                    <Tag color="rose">Subtheme</Tag>
                                    <CodeBubble code={s.code} />
                                  </div>
                                  <div className="truncate text-[15px] font-medium text-slate-900">
                                    {s.name}
                                  </div>
                                  {s.description ? (
                                    <p className="mt-0.5 text-sm text-slate-600">
                                      {s.description}
                                    </p>
                                  ) : null}
                                </div>
                                <div className="ml-3 flex items-center gap-2">
                                  <SortBadge n={s.sort_order} />
                                  <div className="mx-1 h-5 w-px bg-slate-200" />
                                  <IconBtn
                                    title="Edit subtheme"
                                    onClick={noop(`edit subtheme ${s.code}`)}
                                    disabled={!canEdit}
                                  >
                                    ✎
                                  </IconBtn>
                                  <IconBtn
                                    title="Move up"
                                    onClick={noop(`move up subtheme ${s.code}`)}
                                    disabled={!canEdit}
                                  >
                                    ↑
                                  </IconBtn>
                                  <IconBtn
                                    title="Move down"
                                    onClick={noop(`move down subtheme ${s.code}`)}
                                    disabled={!canEdit}
                                  >
                                    ↓
                                  </IconBtn>
                                  <IconBtn
                                    title="Delete subtheme"
                                    onClick={noop(`delete subtheme ${s.code}`)}
                                    disabled={!canEdit}
                                  >
                                    🗑
                                  </IconBtn>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
    </div>
  );
}
