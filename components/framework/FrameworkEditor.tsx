// components/framework/FrameworkEditor.tsx
"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Upload,
  Download,
} from "lucide-react";
import Badge from "@/components/ui/badge"; // ✅ default import
import Button from "@/components/ui/button"; // ✅ default import
import {
  addPillar,
  addTheme,
  addSubtheme,
  removeItem,
} from "@/lib/framework-actions";
import {
  NormalizedPillar,
  NormalizedTheme,
  NormalizedSubtheme,
} from "@/lib/framework-utils";

type FrameworkEditorProps = {
  data: NormalizedPillar[];
};

export default function FrameworkEditor({ data }: FrameworkEditorProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editMode, setEditMode] = useState(false);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    data.forEach((p) => {
      all[p.id] = true;
      p.themes?.forEach((t) => {
        all[t.id] = true;
        t.subthemes?.forEach((st) => {
          all[st.id] = true;
        });
      });
    });
    setExpanded(all);
  };

  const collapseAll = () => {
    setExpanded({});
  };

  return (
    <div className="space-y-4">
      {/* Top controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button size="sm" onClick={expandAll}>
            Expand All
          </Button>
          <Button size="sm" onClick={collapseAll}>
            Collapse All
          </Button>
          {editMode ? (
            <>
              <Button
                size="sm"
                className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                onClick={() => addPillar()}
              >
                + Add Pillar
              </Button>
              <Button
                size="sm"
                className="bg-rust-100 text-rust-800 hover:bg-rust-200"
                onClick={() => setEditMode(false)}
              >
                Exit Edit Mode
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              className="bg-rust-100 text-rust-800 hover:bg-rust-200"
              onClick={() => setEditMode(true)}
            >
              Enter Edit Mode
            </Button>
          )}
        </div>
        {editMode && (
          <div className="flex space-x-2">
            <Upload className="w-4 h-4 text-gray-600 cursor-pointer" />
            <Download className="w-4 h-4 text-gray-600 cursor-pointer" />
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-1/5 px-4 py-2 text-left font-semibold">
                Type / Ref Code
              </th>
              <th className="w-3/5 px-4 py-2 text-left font-semibold">
                Name / Description
              </th>
              <th className="w-1/10 px-4 py-2 text-center font-semibold">
                Sort Order
              </th>
              <th className="w-1/10 px-4 py-2 text-right font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((pillar) => (
              <React.Fragment key={pillar.id}>
                {/* Pillar row */}
                <tr>
                  <td className="px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleExpand(pillar.id)}
                        className="text-gray-500"
                      >
                        {expanded[pillar.id] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      <Badge>{`Pillar ${pillar.ref_code}`}</Badge>
                    </div>
                  </td>
                  <td className="px-4 py-2">{pillar.name}</td>
                  <td className="px-4 py-2 text-center">
                    {pillar.sort_order}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {editMode && (
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          onClick={() => addTheme(pillar.id)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => removeItem("pillar", pillar.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>

                {/* Themes */}
                {expanded[pillar.id] &&
                  pillar.themes?.map((theme) => (
                    <React.Fragment key={theme.id}>
                      <tr>
                        <td className="px-4 py-2 pl-10">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleExpand(theme.id)}
                              className="text-gray-500"
                            >
                              {expanded[theme.id] ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                            <Badge variant="success">{`Theme ${theme.ref_code}`}</Badge>
                          </div>
                        </td>
                        <td className="px-4 py-2">{theme.name}</td>
                        <td className="px-4 py-2 text-center">
                          {theme.sort_order}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {editMode && (
                            <div className="flex justify-end space-x-2">
                              <Button
                                size="sm"
                                onClick={() => addSubtheme(theme.id)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => removeItem("theme", theme.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Subthemes */}
                      {expanded[theme.id] &&
                        theme.subthemes?.map((sub) => (
                          <tr key={sub.id}>
                            <td className="px-4 py-2 pl-16">
                              <Badge variant="danger">{`Subtheme ${sub.ref_code}`}</Badge>
                            </td>
                            <td className="px-4 py-2">{sub.name}</td>
                            <td className="px-4 py-2 text-center">
                              {sub.sort_order}
                            </td>
                            <td className="px-4 py-2 text-right">
                              {editMode && (
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      removeItem("subtheme", sub.id)
                                    }
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
