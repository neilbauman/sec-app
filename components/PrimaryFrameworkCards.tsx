'use client';

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export type Pillar = { code: string; name: string };
export type Theme = { code: string; name: string; pillar: string };
export type Subtheme = { code: string; name: string; theme: string };

type Props = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

export default function PrimaryFrameworkCards({ pillars, themes, subthemes }: Props) {
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record[string, boolean>>({} as any);

  const byPillar: Record<string, Theme[]> = {};
  for (const t of themes) {
    byPillar[t.pillar] ??= [];
    byPillar[t.pillar].push(t);
  }
  const byTheme: Record<string, Subtheme[]> = {};
  for (const s of subthemes) {
    byTheme[s.theme] ??= [];
    byTheme[s.theme].push(s);
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {pillars.map((p) => {
        const isOpen = openPillars[p.code] ?? true;
        return (
          <div key={p.code} style={{ border: "1px solid #e5e7eb", borderRadius: 12 }}>
            <button
              onClick={() => setOpenPillars(prev => ({ ...prev, [p.code]: !isOpen }))}
              style={{ width: "100%", textAlign: "left", padding: 12, display: "flex", alignItems: "center", gap: 8 }}
            >
              {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              <strong>{p.name}</strong>
              <span style={{ marginLeft: 8, color: "#6b7280" }}>({p.code})</span>
            </button>

            {isOpen && (
              <div style={{ borderTop: "1px solid #e5e7eb" }}>
                {(byPillar[p.code] ?? []).map((t) => {
                  const tOpen = openThemes[t.code] ?? true;
                  return (
                    <div key={t.code} style={{ padding: "8px 12px", borderTop: "1px solid #f3f4f6" }}>
                      <button
                        onClick={() => setOpenThemes(prev => ({ ...prev, [t.code]: !tOpen }))}
                        style={{ display: "flex", alignItems: "center", gap: 8 }}
                      >
                        {tOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        <span><strong>{t.name}</strong> <span style={{ color: "#6b7280" }}>({t.code})</span></span>
                      </button>
                      {tOpen && (
                        <ul style={{ marginTop: 8, paddingLeft: 28 }}>
                          {(byTheme[t.code] ?? []).map((s) => (
                            <li key={s.code} style={{ padding: "4px 0" }}>
                              {s.name} <span style={{ color: "#6b7280" }}>({s.code})</span>
                            </li>
                          ))}
                          {((byTheme[t.code] ?? []).length === 0) && (
                            <li style={{ color: "#9ca3af" }}>No subthemes yet.</li>
                          )}
                        </ul>
                      )}
                    </div>
                  );
                })}
                {((byPillar[p.code] ?? []).length === 0) && (
                  <div style={{ padding: 12, color: "#9ca3af" }}>No themes yet.</div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
