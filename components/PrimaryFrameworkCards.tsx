"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

export type Pillar = { code: string; name: string; description?: string; };
export type Theme = { code: string; pillar_code: string; name: string; description?: string; };
export type Subtheme = { code: string; theme_code: string; name: string; description?: string; };

type Props = { pillars: Pillar[]; themes: Theme[]; subthemes: Subtheme[]; };

export default function PrimaryFrameworkCards({ pillars, themes, subthemes }: Props) {
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  const byPillar: Record<string, Theme[]> = {};
  for (const t of themes) {
    (byPillar[t.pillar_code] ||= []).push(t);
  }

  const byTheme: Record<string, Subtheme[]> = {};
  for (const s of subthemes) {
    (byTheme[s.theme_code] ||= []).push(s);
  }

  return (
    <div className="space-y-3">
      {pillars.map((p) => {
        const isOpen = openPillars[p.code] ?? false;
        return (
          <div key={p.code} className="card">
            <button
              className="w-full text-left px-4 py-3 flex items-center justify-between"
              onClick={() => setOpenPillars((m) => ({ ...m, [p.code]: !isOpen }))}
            >
              <div>
                <div className="badge mr-2">Pillar</div>
                <span className="font-semibold">{p.name}</span>
                {p.description && <p className="text-sm text-slate-600">{p.description}</p>}
              </div>
              <ChevronRight className={`transition-transform ${isOpen ? "rotate-90" : ""}`} size={18} />
            </button>

            {isOpen && (
              <div className="divide-y">
                {(byPillar[p.code] ?? []).map((t) => {
                  const tOpen = openThemes[t.code] ?? false;
                  return (
                    <div key={t.code} className="px-4 py-3">
                      <button
                        className="w-full text-left flex items-center justify-between"
                        onClick={() => setOpenThemes((m) => ({ ...m, [t.code]: !tOpen }))}
                      >
                        <div>
                          <div className="badge mr-2">Theme</div>
                          <span className="font-medium">{t.name}</span>
                          {t.description && <p className="text-sm text-slate-600">{t.description}</p>}
                        </div>
                        <ChevronRight className={`transition-transform ${tOpen ? "rotate-90" : ""}`} size={16} />
                      </button>

                      {tOpen && (
                        <ul className="mt-2 ml-4 list-disc text-slate-700">
                          {(byTheme[t.code] ?? []).map((s) => (
                            <li key={s.code} className="py-0.5">
                              <span className="text-sm">{s.name}</span>
                            </li>
                          ))}
                        </ul>
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
  );
}
