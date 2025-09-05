// app/framework/page.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabaseClient'; // your existing export
import { Button } from 'antd';
import {
  CaretDownOutlined,
  CaretRightOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';

// ---------- styling helpers ----------
const typeBadgeStyles: Record<string, React.CSSProperties> = {
  pillar:   { background: 'rgba(204,182,173,0.25)', color: '#5a463d', border: '1px solid rgba(204,182,173,0.45)' },
  theme:    { background: 'rgba(180,179,185,0.22)', color: '#3f3f46', border: '1px solid rgba(180,179,185,0.45)' },
  subtheme: { background: 'rgba(202,212,226,0.22)', color: '#334155', border: '1px solid rgba(202,212,226,0.45)' },
};

const levelLabel = (lvl: string) =>
  lvl === 'pillar' ? 'Pillar' : lvl === 'theme' ? 'Theme' : 'Sub-theme';

// ---------- types ----------
type FlatRow = {
  id: string | number;
  level: 'pillar' | 'theme' | 'subtheme';
  code: string;
  name: string;
  description: string | null;
  parent_code: string | null;
  sort_order: number | null;
};

type TreeRow = FlatRow & {
  children?: TreeRow[];
};

// ---------- utilities ----------
function normalize(row: any): FlatRow {
  // Map/rename here if your view uses different column names
  return {
    id: row.id,
    level: row.level,
    code: row.code,
    name: row.name,
    description: row.description ?? null,
    parent_code: row.parent_code ?? null,
    sort_order: row.sort_order ?? null,
  } as FlatRow;
}

function buildTree(rows: FlatRow[]): TreeRow[] {
  // Index by code for fast parent lookups
  const byCode = new Map<string, TreeRow>();
  rows.forEach(r => byCode.set(r.code, { ...r, children: [] }));
  const roots: TreeRow[] = [];

  rows.forEach(r => {
    const node = byCode.get(r.code)!;
    if (r.parent_code && byCode.has(r.parent_code)) {
      byCode.get(r.parent_code)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });

  // Sort children by sort_order then name
  const sortFn = (a: TreeRow, b: TreeRow) => {
    const ao = a.sort_order ?? 9999;
    const bo = b.sort_order ?? 9999;
    if (ao !== bo) return ao - bo;
    return a.name.localeCompare(b.name);
  };

  const sortDeep = (nodes: TreeRow[]) => {
    nodes.sort(sortFn);
    nodes.forEach(n => n.children && sortDeep(n.children));
  };
  sortDeep(roots);

  // Ensure root groups show Pillars > Themes > Sub-themes
  const levelRank = (lvl: string) => (lvl === 'pillar' ? 0 : lvl === 'theme' ? 1 : 2);
  roots.sort((a, b) => levelRank(a.level) - levelRank(b.level) || sortFn(a, b));
  return roots;
}

// Flatten for rendering with indentation & expand/collapse
type RenderRow = TreeRow & { depth: number; isLeaf: boolean; path: string };

function flattenForRender(nodes: TreeRow[], expanded: Set<string>, depth = 0, acc: RenderRow[] = [], parentPath = '') {
  const indent = depth;
  nodes.forEach((n, i) => {
    const path = parentPath ? `${parentPath}/${n.code}` : n.code;
    const isOpen = expanded.has(path);
    const isLeaf = !n.children || n.children.length === 0;
    acc.push({ ...n, depth: indent, isLeaf, path });
    if (!isLeaf && isOpen) {
      flattenForRender(n.children!, expanded, depth + 1, acc, path);
    }
  });
  return acc;
}

// ---------- component ----------
export default function FrameworkPage() {
  const [rows, setRows] = useState<FlatRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set()); // paths, not just codes

  const supabase = useMemo(() => createClient(), []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from('v_framework_flat') // <-- your view
      .select('*');
    setLoading(false);
    if (error) {
      console.error(error);
      setRows([]);
      return;
    }
    // normalize + filter out unexpected levels
    const clean = (data ?? [])
      .map(normalize)
      .filter(r => r.level === 'pillar' || r.level === 'theme' || r.level === 'subtheme');
    setRows(clean);
  }

  useEffect(() => {
    load();
  }, []);

  const tree = useMemo(() => buildTree(rows), [rows]);
  const renderRows = useMemo(() => flattenForRender(tree, expanded), [tree, expanded]);

  const togglePath = (path: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  // --- compact row CSS ---
  const thTd: React.CSSProperties = { padding: '8px 10px', lineHeight: 1.2, verticalAlign: 'middle' };
  const nameCell: React.CSSProperties = { ...thTd, display: 'flex', alignItems: 'center', gap: 10 };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Framework Editor</h1>
        <span style={{ color: '#64748b' }}>Read-only snapshot from database.</span>
        <Button icon={<ReloadOutlined />} size="small" onClick={load} loading={loading}>
          Refresh
        </Button>
      </div>

      <div style={{ border: '1px solid #eef2f7', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#fafafa' }}>
            <tr>
              <th style={{ ...thTd, width: 60 }}>Order</th>
              <th style={{ ...thTd, width: 220 }}>Name / Code</th>
              <th style={{ ...thTd }}>Description / Notes</th>
              <th style={{ ...thTd, width: 180 }}>Parent</th>
              <th style={{ ...thTd, width: 120, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {renderRows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 24, color: '#94a3b8' }}>
                  No data
                </td>
              </tr>
            )}

            {renderRows.map((r) => {
              const badgeStyle = typeBadgeStyles[r.level];
              const indentPx = r.depth * 20;

              return (
                <tr key={r.path} className="compact-row" style={{ borderTop: '1px solid #f0f2f5' }}>
                  {/* sort/order */}
                  <td style={{ ...thTd, color: '#94a3b8', width: 60 }}>
                    {r.sort_order ?? ''}
                  </td>

                  {/* name + type tag + expander */}
                  <td style={{ ...nameCell }}>
                    <div style={{ paddingLeft: indentPx, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {!r.isLeaf ? (
                        <span
                          role="button"
                          onClick={() => togglePath(r.path)}
                          style={{ cursor: 'pointer', color: '#64748b' }}
                          aria-label={expanded.has(r.path) ? 'Collapse' : 'Expand'}
                        >
                          {expanded.has(r.path) ? <CaretDownOutlined /> : <CaretRightOutlined />}
                        </span>
                      ) : (
                        <span style={{ width: 14 }} />
                      )}

                      <span
                        style={{
                          ...badgeStyle,
                          fontSize: 11,
                          padding: '2px 6px',
                          borderRadius: 999,
                          whiteSpace: 'nowrap',
                        }}
                        title={levelLabel(r.level)}
                      >
                        {levelLabel(r.level)}
                      </span>

                      <span style={{ fontWeight: 600 }}>{r.name}</span>
                      <span style={{ color: '#94a3b8' }}>{r.code}</span>
                    </div>
                  </td>

                  {/* description */}
                  <td style={{ ...thTd, color: '#334155' }}>
                    {r.description || <span style={{ color: '#cbd5e1' }}>—</span>}
                  </td>

                  {/* parent */}
                  <td style={{ ...thTd, color: '#64748b' }}>{r.parent_code ?? '—'}</td>

                  {/* actions (kept minimal here; wire to your handlers if needed) */}
                  <td style={{ ...thTd, textAlign: 'right' }}>
                    <Button type="text" size="small" icon={<EditOutlined />} />
                    <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style jsx global>{`
        .compact-row td {
          padding-top: 7px !important;
          padding-bottom: 7px !important;
        }
      `}</style>
    </div>
  );
}
