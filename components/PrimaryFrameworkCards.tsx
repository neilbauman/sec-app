'use client';

import { useState } from 'react';
import type { Pillar, Theme, Subtheme } from '@/lib/framework';

type Props = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

export default function PrimaryFrameworkCards({ pillars, themes, subthemes }: Props) {
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  // Group themes by pillar, and subthemes by theme
  const themesByPillar: Record<string, Theme[]> = {};
  for (const t of themes) {
    const key = (t as any).pillar_code ?? (t as any).pillarCode ?? (t as any).pillar_id ?? "";
    if (!themesByPillar[key]) themesByPillar[key] = [];
    themesByPillar[key].push(t);
  }

  const subsByTheme: Record<string, Subtheme[]> = {};
  for (const s of subthemes) {
    const key = (s as any).theme_code ?? (s as any).themeCode ?? (s as any).theme_id ?? "";
    if (!subsByTheme[key]) subsByTheme[key] = [];
    subsByTheme[key].push(s);
  }

  return (
    <div>
      {pillars.map(p => {
        const pKey = (p as any).code ?? (p as any).id ?? '';
        const isOpen = openPillars[pKey] ?? false;
        return (
          <div key={pKey} style={{ border: "1px solid #e5e7eb", borderRadius: 12, marginBottom: 12 }}>
            <button
              onClick={() => setOpenPillars({ ...openPillars, [pKey]: !isOpen })}
              style={{ width: "100%", textAlign: "left", padding: 12, background: "white", border: "none", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 14, color: "#6b7280" }}>Pillar</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{(p as any).name ?? pKey}</div>
                  {(p as any).description ? <div style={{ color: "#374151" }}>{(p as any).description}</div> : null}
                </div>
                <div>{isOpen ? "▾" : "▸"}</div>
              </div>
            </button>

            {isOpen && (
              <div style={{ borderTop: "1px solid #e5e7eb" }}>
                {(themesByPillar[pKey] ?? []).map(t => {
                  const tKey = (t as any).code ?? (t as any).id ?? '';
                  const tOpen = openThemes[tKey] ?? false;
                  return (
                    <div key={tKey} style={{ padding: "12px 16px", borderTop: "1px dashed #e5e7eb" }}>
                      <button
                        onClick={() => setOpenThemes({ ...openThemes, [tKey]: !tOpen })}
                        style={{ background: "transparent", border: "none", width: "100%", textAlign: "left", cursor: "pointer" }}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div>
                            <span style={{ fontSize: 12, color: "#6b7280", marginRight: 8 }}>Theme</span>
                            <span style={{ fontSize: 16, fontWeight: 600 }}>{(t as any).name ?? tKey}</span>
                          </div>
                          <div>{tOpen ? "▾" : "▸"}</div>
                        </div>
                      </button>

                      {tOpen && (
                        <ul style={{ marginTop: 8, marginLeft: 8 }}>
                          {(subsByTheme[tKey] ?? []).map(s => {
                            const sKey = (s as any).code ?? (s as any).id ?? '';
                            return (
                              <li key={sKey} style={{ padding: "6px 0", color: "#111827" }}>
                                <span style={{ fontSize: 12, color: "#6b7280", marginRight: 8 }}>Subtheme</span>
                                <span style={{ fontWeight: 500 }}>{(s as any).name ?? sKey}</span>
                                {(s as any).description ? <div style={{ color: "#374151" }}>{(s as any).description}</div> : null}
                              </li>
                            );
                          })}
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
