"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Edit, Trash } from "lucide-react";
import { supabase } from "../../lib/supabase-browser"; // ✅ FIXED PATH

interface Subtheme {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
}

interface Theme {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  subthemes: Subtheme[];
}

interface Pillar {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  themes: Theme[];
}

export default function PrimaryFrameworkEditorClient() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    async function fetchFramework() {
      const { data: pillarsData, error } = await supabase
        .from("pillars")
        .select(
          "id, name, description, sort_order, themes(id, name, description, sort_order, subthemes(id, name, description, sort_order)))"
        )
        .order("sort_order");

      if (error) {
        console.error("Error fetching pillars:", error);
        return;
      }

      setPillars(pillarsData || []);
    }

    fetchFramework();
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {pillars.length === 0 && (
        <p className="text-gray-500">No pillars found. Start by adding one.</p>
      )}

      {pillars.map((pillar) => (
        <div key={pillar.id} className="border rounded-lg p-4 shadow-sm bg-white">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => toggleExpand(pillar.id)}
          >
            {expanded[pillar.id] ? (
              <ChevronDown className="w-5 h-5 mr-2" />
            ) : (
              <ChevronRight className="w-5 h-5 mr-2" />
            )}
            <span className="font-semibold text-blue-600">{pillar.name}</span>
            <div className="ml-auto flex space-x-2">
              <Plus className="w-4 h-4 cursor-pointer text-green-600" />
              <Edit className="w-4 h-4 cursor-pointer text-yellow-600" />
              <Trash className="w-4 h-4 cursor-pointer text-red-600" />
            </div>
          </div>
          {expanded[pillar.id] && (
            <div className="ml-6 mt-2 space-y-2">
              {pillar.themes.map((theme) => (
                <div key={theme.id} className="border-l-2 pl-4">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => toggleExpand(theme.id)}
                  >
                    {expanded[theme.id] ? (
                      <ChevronDown className="w-4 h-4 mr-2" />
                    ) : (
                      <ChevronRight className="w-4 h-4 mr-2" />
                    )}
                    <span className="text-green-600">{theme.name}</span>
                    <div className="ml-auto flex space-x-2">
                      <Plus className="w-4 h-4 cursor-pointer text-green-600" />
                      <Edit className="w-4 h-4 cursor-pointer text-yellow-600" />
                      <Trash className="w-4 h-4 cursor-pointer text-red-600" />
                    </div>
                  </div>
                  {expanded[theme.id] && (
                    <div className="ml-6 mt-2 space-y-2">
                      {theme.subthemes.map((sub) => (
                        <div
                          key={sub.id}
                          className="border-l-2 pl-4 flex items-center"
                        >
                          <span className="text-yellow-600">{sub.name}</span>
                          <div className="ml-auto flex space-x-2">
                            <Edit className="w-4 h-4 cursor-pointer text-yellow-600" />
                            <Trash className="w-4 h-4 cursor-pointer text-red-600" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
