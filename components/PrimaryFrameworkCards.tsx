"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  GripVertical,
  PencilLine,
  Plus,
  X,
} from "lucide-react";

type Pillar = {
  code: string;
  name: string;
  description: string | null;
  sort_order?: number | null;
};

type Theme = {
  code: string;
  pillar_code: string;
  name: string;
  description: string | null;
  sort_order?: number | null;
};

type Subtheme = {
  code: string;
  theme_code: string;
  name: string;
  description: string | null;
  sort_order?: number | null;
};

type Props = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

/* ---------- small helpers ---------- */

const badge =
  "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium text-slate-600 border-slate-200 bg-slate-50";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function bySort<T extends { sort_order?: number | null; code: string }>(
  a: T,
  b: T
) {
  const sa = a.sort_order ?? Number.MAX_SAFE_INTEGER;
  const sb = b.sort_order ?? Number.MAX_SAFE_INTEGER;
  return sa === sb ? a.code.localeCompare(b.code) : sa - sb;
}

/* ---------- lightweight Edit Dialog (no deps) ---------- */

type EditPayload = {
  kind: "pillar" | "theme" | "subtheme";
  code: string;
  name: string;
  description: string | null;
};

function useDialog<T>() {
  const ref = useRef<HTMLDialogElement>(null);
  const [data, setData] = useState<T | null>(null);
  const open = (d: T) => {
    setData(d);
    ref.current?.showModal();
  };
  const close = () => {
    ref.current?.close();
  };
  return { ref, data, open, close, setData };
}

function EditDialog({
  hook,
  onSave,
}: {
  hook: ReturnType<typeof useDialog<EditPayload>>;
  onSave: (p: EditPayload) => void;
}) {
  const { ref, data, close, setData } = hook;
  if (!data) return null;
  return (
    <dialog
      ref={ref}
      className="rounded-xl p-0 backdrop:bg-black/20 w-[min(560px,calc(100vw-2rem))]"
    >
      <form
        method="dialog"
        className="p-5 border-b border-slate-200 flex items-center justify-between"
      >
        <h3 className="text-base font-semibold">
          {`Edit ${data.kind[0].toUpperCase()}${data.kind.slice(1)}`}
        </h3>
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100"
          onClick={close}
        >
          <X className="h-4 w-4" />
        </button>
      </form>

      <div className="p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Code
          </label>
          <input
            disabled
            value={data.code}
            className="mt-1 block w-full rounded-md border-slate-200 bg-slate-50 text-slate-700 shadow-sm focus:ring-0"
          />
          <p className="mt-1 text-xs text-slate-500">
            Codes are immutable in this UI.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Name
          </label>
          <input
            value={data.name}
            onChange={(e) =>
              setData({ ...data, name: (e.target as HTMLInputElement).value })
            }
            className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:ring-0"
            placeholder="Enter a name…"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            value={data.description ?? ""}
            onChange={(e) =>
              setData({
                ...data,
                description: (e.target as HTMLTextAreaElement).value || null,
              })
            }
            rows={4}
            className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:ring-0"
            placeholder="Optional description…"
          />
        </div>
      </div>

      <div className="p-5 border-t border-slate-200 flex items-center justify-end gap-2">
        <button
          className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          onClick={close}
        >
          Cancel
        </button>
        <button
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          onClick={() => {
            onSave(data);
            close();
          }}
        >
          Save (local)
        </button>
      </div>
    </dialog>
  );
}

/* ---------- main component ---------- */

export default function PrimaryFrameworkCards({
  pillars,
  themes,
  subthemes,
}: Props) {
  // Local working copies so edits/sorts don’t affect server until we wire it up.
  const [localPillars, setLocalPillars] = useState<Pillar[]>(
    [...pillars].sort(bySort)
  );
  const [localThemes, setLocalThemes] = useState<Theme[]>(
    [...themes].sort(bySort)
  );
  const [localSubs, setLocalSubs] = useState<Subtheme[]>(
    [...subthemes].sort(bySort)
  );

  // Collapse state
  const [openPillar, setOpenPillar] = useState<Record<string, boolean>>({});
  const [openTheme, setOpenTheme] = useState<Record<string, boolean>>({});

  // Quick indexes
  const themesByPillar = useMemo(() => {
    const map: Record<string, Theme[]> = {};
    for (const t of localThemes) {
      (map[t.pillar_code] ||= []).push(t);
    }
    for (const k of Object.keys(map)) map[k].sort(bySort);
    return map;
  }, [localThemes]);

  const subsByTheme = useMemo(() => {
    const map: Record<string, Subtheme[]> = {};
    for (const s of localSubs) {
      (map[s.theme_code] ||= []).push(s);
    }
    for (const k of Object.keys(map)) map[k].sort(bySort);
    return map;
  }, [localSubs]);

  // Editing
  const edit = useDialog<EditPayload>();
  const onSave = (p: EditPayload) => {
    if (p.kind === "pillar") {
      setLocalPillars((arr) =>
        arr.map((x) =>
          x.code === p.code ? { ...x, name: p.name, description: p.description } : x
        )
      );
    } else if (p.kind === "theme") {
      setLocalThemes((arr) =>
        arr.map((x) =>
          x.code === p.code ? { ...x, name: p.name, description: p.description } : x
        )
      );
    } else {
      setLocalSubs((arr) =>
        arr.map((x) =>
          x.code === p.code ? { ...x, name: p.name, description: p.description } : x
        )
      );
    }
  };

  // Basic HTML5 drag & drop (progressive enhancement, local only)
  const dragItem = useRef<{ kind: "pillar" | "theme" | "subtheme"; code: string } | null>(null);

  function startDrag(kind: "pillar" | "theme" | "subtheme", code: string, e: React.DragEvent) {
    dragItem.current = { kind, code };
    e.dataTransfer.setData("text/plain", JSON.stringify(dragItem.current));
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDropPillar(targetCode: string, e: React.DragEvent) {
    e.preventDefault();
    const data = dragItem.current;
    if (!data || data.kind !== "pillar") return;
    setLocalPillars((arr) => reorder(arr, data.code, targetCode));
  }

  function handleDropTheme(targetCode: string, e: React.DragEvent) {
    e.preventDefault();
    const data = dragItem.current;
    if (!data || data.kind !== "theme") return;
    setLocalThemes((arr) => reorder(arr, data.code, targetCode));
  }

  function handleDropSubtheme(targetCode: string, e: React.DragEvent) {
    e.preventDefault();
    const data = dragItem.current;
    if (!data || data.kind !== "subtheme") return;
    setLocalSubs((arr) => reorder(arr, data.code, targetCode));
  }

  function reorder<T extends { code: string }>(arr: T[], sourceCode: string, targetCode: string) {
    if (sourceCode === targetCode) return arr;
    const next = [...arr];
    const from = next.findIndex((x) => x.code === sourceCode);
    const to = next.findIndex((x) => x.code === targetCode);
    if (from === -1 || to === -1) return arr;
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    // Renumber sort_order locally
    return next.map((x, i) => ({ ...x, sort_order: i + 1 }));
  }

  return (
    <div className="space-y-4">
      <EditDialog hook={edit} onSave={onSave} />

      {/* Top toolbar */}
      <div className="sticky top-0 z-10 -mt-2 mb-1 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex items-center justify-between border-b border-slate-200 py-2">
          <div className="text-sm text-slate-600">
            Drag the grip to reorder. Click the pencil to edit. Changes are <span className="font-medium">local only</span> until we wire Save.
          </div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
              onClick={() => alert("Coming soon: Add pillar")}
            >
              <Plus className="h-4 w-4" /> Add Pillar
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800"
              onClick={() => alert("Coming soon: Persist to Supabase")}
            >
              Save All
            </button>
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="space-y-3">
        {localPillars.map((p) => {
          const isOpen = openPillar[p.code] ?? true;
          const pThemes = themesByPillar[p.code] ?? [];
          return (
            <section
              key={p.code}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropPillar(p.code, e)}
              className="rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <header className="flex items-center gap-2 px-4 py-3">
                <button
                  className="rounded-md hover:bg-slate-100 p-1"
                  onClick={() =>
                    setOpenPillar((s) => ({ ...s, [p.code]: !isOpen }))
                  }
                  aria-label={isOpen ? "Collapse pillar" : "Expand pillar"}
                >
                  {isOpen ? (
                    <ChevronDown className="h-5 w-5 text-slate-600" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-slate-600" />
                  )}
                </button>

                <div
                  draggable
                  onDragStart={(e) => startDrag("pillar", p.code, e)}
                  title="Drag to reorder pillars"
                  className="cursor-grab active:cursor-grabbing rounded-md p-1 hover:bg-slate-100 text-slate-500"
                >
                  <GripVertical className="h-4 w-4" />
                </div>

                <span className={badge}>Pillar</span>

                <div className="ml-2 min-w-0 flex-1">
                  <div className="font-medium text-slate-900">{p.name}</div>
                  {p.description && (
                    <div className="text-sm text-slate-600 line-clamp-1">
                      {p.description}
                    </div>
                  )}
                </div>

                <button
                  className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm hover:bg-slate-50"
                  onClick={() =>
                    edit.open({
                      kind: "pillar",
                      code: p.code,
                      name: p.name,
                      description: p.description ?? "",
                    })
                  }
                >
                  <PencilLine className="h-4 w-4" />
                  Edit
                </button>
              </header>

              {isOpen && pThemes.length > 0 && (
                <div className="divide-y divide-slate-200">
                  {pThemes.map((t) => {
                    const tOpen = openTheme[t.code] ?? true;
                    const tSubs = subsByTheme[t.code] ?? [];
                    return (
                      <div key={t.code} className="px-4 py-2">
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => handleDropTheme(t.code, e)}
                          className="flex items-start gap-2"
                        >
                          <button
                            className="rounded-md hover:bg-slate-100 p-1 mt-0.5"
                            onClick={() =>
                              setOpenTheme((s) => ({ ...s, [t.code]: !tOpen }))
                            }
                            aria-label={tOpen ? "Collapse theme" : "Expand theme"}
                          >
                            {tOpen ? (
                              <ChevronDown className="h-5 w-5 text-slate-600" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-slate-600" />
                            )}
                          </button>

                          <div
                            draggable
                            onDragStart={(e) => startDrag("theme", t.code, e)}
                            title="Drag to reorder themes"
                            className="cursor-grab active:cursor-grabbing rounded-md p-1 hover:bg-slate-100 text-slate-500 mt-0.5"
                          >
                            <GripVertical className="h-4 w-4" />
                          </div>

                          <span className={badge}>Theme</span>

                          <div className="ml-2 min-w-0 flex-1">
                            <div className="font-medium text-slate-900">
                              {t.name}
                            </div>
                            {t.description && (
                              <div className="text-sm text-slate-600 line-clamp-1">
                                {t.description}
                              </div>
                            )}
                          </div>

                          <button
                            className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm hover:bg-slate-50"
                            onClick={() =>
                              edit.open({
                                kind: "theme",
                                code: t.code,
                                name: t.name,
                                description: t.description ?? "",
                              })
                            }
                          >
                            <PencilLine className="h-4 w-4" />
                            Edit
                          </button>
                        </div>

                        {tOpen && tSubs.length > 0 && (
                          <div className="mt-2 ml-8 space-y-1">
                            {tSubs.map((s) => (
                              <div
                                key={s.code}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDropSubtheme(s.code, e)}
                                className="group flex items-start gap-2 rounded-lg px-2 py-2 hover:bg-slate-50"
                              >
                                <div
                                  draggable
                                  onDragStart={(e) =>
                                    startDrag("subtheme", s.code, e)
                                  }
                                  title="Drag to reorder subthemes"
                                  className="invisible group-hover:visible cursor-grab active:cursor-grabbing rounded-md p-1 hover:bg-slate-100 text-slate-500 mt-0.5"
                                >
                                  <GripVertical className="h-4 w-4" />
                                </div>

                                <span className={badge}>Subtheme</span>

                                <div className="ml-2 min-w-0 flex-1">
                                  <div className="text-[15px] font-medium text-slate-900">
                                    {s.name}
                                  </div>
                                  {s.description && (
                                    <div className="text-sm text-slate-600 line-clamp-1">
                                      {s.description}
                                    </div>
                                  )}
                                </div>

                                <button
                                  className="invisible group-hover:visible inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm hover:bg-slate-50"
                                  onClick={() =>
                                    edit.open({
                                      kind: "subtheme",
                                      code: s.code,
                                      name: s.name,
                                      description: s.description ?? "",
                                    })
                                  }
                                >
                                  <PencilLine className="h-4 w-4" />
                                  Edit
                                </button>
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
    </div>
  );
}
