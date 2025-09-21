"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, Upload, Download } from "lucide-react";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import {
  NormalizedPillar,
  NormalizedTheme,
  NormalizedSubtheme,
} from "@/lib/framework-utils";
import {
  addPillar,
  addTheme,
  addSubtheme,
  removePillar,
  removeTheme,
  removeSubtheme,
} from "@/lib/framework-actions";

// Props expect already-normalized data
export type FrameworkEditorProps = {
  data: NormalizedPillar[];
};

// Small indentation used for nested rows (kept subtle per UI feedback)
const INDENT = "pl-5"; // slightly smaller than before

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [pillars, setPillars] = useState<NormalizedPillar[]>(data);
  const [editMode, setEditMode] = useState(false);

  // track expanded state per id
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  // quick helpers
  const expandAll = () => {
    const p: Record<string, boolean> = {};
    const t: Record<string, boolean> = {};
    pillars.forEach((pi) => {
      p[pi.id] = true;
      pi.themes?.forEach((th) => {
        t[th.id] = true;
      });
    });
    setOpenPillars(p);
    setOpenThemes(t);
  };

  const collapseAll = () => {
    setOpenPillars({});
    setOpenThemes({});
  };

  // ---- Action handlers (stay in edit mode after any action) ----
  const onAddPillar = () => {
    const updated = addPillar(pillars);
    setPillars(updated);
  };

  const onAddTheme = (pillarId: string) => {
    const updated = addTheme(pillars, pillarId);
    setPillars(updated);
    setOpenPillars((s) => ({ ...s, [pillarId]: true }));
  };

  const onAddSubtheme = (themeId: string, pillarId: string) => {
    const updated = addSubtheme(pillars, themeId);
    setPillars(updated);
    setOpenPillars((s) => ({ ...s, [pillarId]: true }));
    setOpenThemes((s) => ({ ...s, [themeId]: true }));
  };

  const onRemovePillar = (pillarId: string) => {
    const updated = removePillar(pillars, pillarId);
    setPillars(updated);
  };

  const onRemoveTheme = (themeId: string) => {
    const updated = removeTheme(pillars, themeId);
    setPillars(updated);
  };

  const onRemoveSubtheme = (subId: string) => {
    const updated = removeSubtheme(pillars, subId);
    setPillars(updated);
  };

  // compute display ref codes on the fly so we never depend on DB columns
  const displayPillars = useMemo(() => {
    return pillars.map((p, pIdx) => {
      const pCode = `P${pIdx + 1}`;
      const themes = (p.themes || []).map((t, tIdx) => {
        const tCode = `T${pIdx + 1}.${tIdx + 1}`;
        const subs = (t.subthemes || []).map((s, sIdx) => ({
          ...s,
          __ref: `ST${pIdx + 1}.${tIdx + 1}.${sIdx + 1}`,
        }));
        return { ...t, __ref: tCode, subthemes: subs } as NormalizedTheme & { __ref: string; subthemes: (NormalizedSubtheme & { __ref: string })[] };
      });
      return { ...p, __ref: pCode, themes } as NormalizedPillar & { __ref: string; themes: (NormalizedTheme & { __ref: string; subthemes: (NormalizedSubtheme & { __ref: string })[] })[] };
    });
  }, [pillars]);

  // ---- UI pieces ----
  const HeaderBar = () => (
    <div className="flex items-center justify-between mb-3">
      {/* Left controls */}
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={expandAll}>
          Expand all
        </Button>
        <Button size="sm" variant="outline" onClick={collapseAll}>
          Collapse all
        </Button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {editMode && (
          <>
            <button aria-label="Upload CSV" className="p-2 rounded hover:bg-gray-100">
              <Upload className="w-5 h-5 text-gray-600" />
            </button>
            <button aria-label="Download CSV" className="p-2 rounded hover:bg-gray-100">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </>
        )}

        {/* Add Pillar (blue) to the left of Edit toggle (rust) */}
        {editMode && (
          <Button size="sm" variant="primary" onClick={onAddPillar}>
            + Add Pillar
          </Button>
        )}

        <Button size="sm" variant="rust" onClick={() => setEditMode((v) => !v)}>
          {editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        </Button>
      </div>
    </div>
  );

  const TableHeader = () => (
    <div className="grid grid-cols-[26%_54%_10%_10%] text-xs font-semibold text-gray-500 border-b pb-2">
      <div>Type / Ref Code</div>
      <div>Name / Description</div>
      <div className="text-center">Sort</div>
      <div className="text-right">Actions</div>
    </div>
  );

  const CaretButton: React.FC<{ open: boolean; onClick: () => void }> = ({ open, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="mr-2 rounded p-1 hover:bg-gray-100"
      aria-label={open ? "Collapse" : "Expand"}
    >
      {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="bg-white rounded-xl border shadow-sm p-4 md:p-6">
      <HeaderBar />
      <TableHeader />

      {/* Rows */}
      <div className="divide-y">
        {displayPillars.map((p) => {
          const pOpen = !!openPillars[p.id];
          return (
            <div key={p.id} className="py-3">
              {/* Pillar row */}
              <div className="grid grid-cols-[26%_54%_10%_10%] items-start">
                {/* Type/Ref */}
                <div className="flex items-center">
                  <CaretButton open={pOpen} onClick={() => setOpenPillars((s) => ({ ...s, [p.id]: !pOpen }))} />
                  <div className={`flex items-center gap-2 ${INDENT}`}>
                    <Badge variant="default">Pillar</Badge>
                    <span className="text-xs text-gray-500">{p.__ref}</span>
                  </div>
                </div>
                {/* Name/Description */}
                <div className={`${INDENT}`}>
                  <div className="font-medium text-gray-900">{p.name}</div>
                  <div className="text-sm text-gray-600">{p.description}</div>
                </div>
                <div className="text-center tabular-nums text-gray-700">{p.sort_order}</div>
                <div className="flex items-center justify-end gap-2">
                  {editMode && (
                    <>
                      <button
                        className="p-1.5 rounded hover:bg-gray-100"
                        title="Add Theme"
                        onClick={() => onAddTheme(p.id)}
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        className="p-1.5 rounded hover:bg-gray-100"
                        title="Delete Pillar"
                        onClick={() => onRemovePillar(p.id)}
                      >
                        <Trash2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Themes */}
              {pOpen && (p.themes?.length ?? 0) > 0 && (
                <div className="mt-2 space-y-2">
                  {p.themes!.map((t, tIdx) => {
                    const tOpen = !!openThemes[t.id];
                    return (
                      <div key={t.id} className="grid grid-cols-[26%_54%_10%_10%] items-start">
                        {/* Type/Ref */}
                        <div className="flex items-center">
                          <div className={`ml-6 ${INDENT} -ml-1 flex items-center`}>
                            <CaretButton
                              open={tOpen}
                              onClick={() => setOpenThemes((s) => ({ ...s, [t.id]: !tOpen }))}
                            />
                            <div className="flex items-center gap-2">
                              <Badge variant="success">Theme</Badge>
                              <span className="text-xs text-gray-500">{t.__ref}</span>
                            </div>
                          </div>
                        </div>
                        {/* Name/Description */}
                        <div className={`ml-6 ${INDENT}`}>
                          <div className="font-medium text-gray-900">{t.name}</div>
                          <div className="text-sm text-gray-600">{t.description}</div>
                        </div>
                        <div className="text-center tabular-nums text-gray-700">{t.sort_order}</div>
                        <div className="flex items-center justify-end gap-2">
                          {editMode && (
                            <>
                              <button
                                className="p-1.5 rounded hover:bg-gray-100"
                                title="Add Subtheme"
                                onClick={() => onAddSubtheme(t.id, p.id)}
                              >
                                <Plus className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                className="p-1.5 rounded hover:bg-gray-100"
                                title="Delete Theme"
                                onClick={() => onRemoveTheme(t.id)}
                              >
                                <Trash2 className="w-4 h-4 text-gray-600" />
                              </button>
                            </>
                          )}
                        </div>

                        {/* Subthemes */}
                        {tOpen && (t.subthemes?.length ?? 0) > 0 && (
                          <div className="col-span-4 mt-2 space-y-2">
                            {t.subthemes!.map((s) => (
                              <div key={s.id} className="grid grid-cols-[26%_54%_10%_10%] items-start">
                                <div className="flex items-center">
                                  <div className={`ml-12 ${INDENT} flex items-center gap-2`}>
                                    <Badge variant="danger">Subtheme</Badge>
                                    <span className="text-xs text-gray-500">{s.__ref}</span>
                                  </div>
                                </div>
                                <div className={`ml-12 ${INDENT}`}>
                                  <div className="font-medium text-gray-900">{s.name}</div>
                                  <div className="text-sm text-gray-600">{s.description}</div>
                                </div>
                                <div className="text-center tabular-nums text-gray-700">{s.sort_order}</div>
                                <div className="flex items-center justify-end gap-2">
                                  {editMode && (
                                    <button
                                      className="p-1.5 rounded hover:bg-gray-100"
                                      title="Delete Subtheme"
                                      onClick={() => onRemoveSubtheme(s.id)}
                                    >
                                      <Trash2 className="w-4 h-4 text-gray-600" />
                                    </button>
                                  )}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
