"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

interface Subtheme {
  id: string;
  name: string;
}

interface Theme {
  id: string;
  name: string;
  subthemes: Subtheme[];
}

interface Pillar {
  id: string;
  name: string;
  themes: Theme[];
}

export default function FrameworkEditor({ pillars }: { pillars: Pillar[] }) {
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  const togglePillar = (id: string) =>
    setOpenPillars((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleTheme = (id: string) =>
    setOpenThemes((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-6">
      <PageHeader
        group="configuration"
        page="primary"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "Configuration", href: "/configuration" },
          { label: "Primary Framework Editor" },
        ]}
      />

      <div className="space-y-4">
        {pillars.map((pillar, pIndex) => {
          const isOpen = openPillars[pillar.id] ?? true;

          return (
            <div
              key={pillar.id}
              className="border rounded-lg bg-white shadow-sm"
            >
              <button
                onClick={() => togglePillar(pillar.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-green-700 border-b"
              >
                <span>
                  Pillar {pIndex + 1}: {pillar.name}
                </span>
                {isOpen ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>

              {isOpen && (
                <div className="p-4 space-y-3">
                  {pillar.themes.map((theme) => {
                    const themeOpen = openThemes[theme.id] ?? true;

                    return (
                      <div key={theme.id}>
                        <button
                          onClick={() => toggleTheme(theme.id)}
                          className="flex items-center justify-between w-full text-left font-medium text-gray-800"
                        >
                          {theme.name}
                          {themeOpen ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>

                        {themeOpen && (
                          <ul className="ml-6 mt-2 list-disc text-gray-700 space-y-1">
                            {theme.subthemes.map((sub) => (
                              <li key={sub.id}>{sub.name}</li>
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
    </div>
  );
}
