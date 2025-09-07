// app/framework/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function FrameworkPage() {
  return (
    <main style={{ padding: '24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 600 }}>Primary Framework Editor</h1>
      <p style={{ marginTop: 8, opacity: 0.7 }}>
        (placeholder — no Supabase calls yet)
      </p>
    </main>
  );
}

import { useMemo, useState, useCallback } from 'react'

type RowType = 'pillar' | 'theme' | 'subtheme'

type NodeBase = {
  id: string
  type: RowType
  code: string
  name: string
  description?: string
}

type Subtheme = NodeBase & { type: 'subtheme' }
type Theme = NodeBase & { type: 'theme'; children?: Subtheme[] }
type Pillar = NodeBase & { type: 'pillar'; children?: Theme[] }

type AnyNode = Pillar | Theme | Subtheme

// ------- Mock data ONLY (no Supabase) ----------------------------------------
const MOCK_DATA: Pillar[] = [
  {
    id: 'P1',
    type: 'pillar',
    code: 'P1',
    name: 'Pillar One',
    description: 'High-level area 1',
    children: [
      {
        id: 'T1.1',
        type: 'theme',
        code: 'T1.1',
        name: 'Theme A',
        description: 'Theme under P1',
        children: [
          {
            id: 'ST1.1.1',
            type: 'subtheme',
            code: 'ST1.1.1',
            name: 'Sub-theme Alpha',
            description: 'Detail under Theme A',
          },
          {
            id: 'ST1.1.2',
            type: 'subtheme',
            code: 'ST1.1.2',
            name: 'Sub-theme Beta',
            description: 'Another detail under Theme A',
          },
        ],
      },
      {
        id: 'T1.2',
        type: 'theme',
        code: 'T1.2',
        name: 'Theme B',
        description: 'Another theme under P1',
        children: [
          {
            id: 'ST1.2.1',
            type: 'subtheme',
            code: 'ST1.2.1',
            name: 'Sub-theme Gamma',
            description: 'Detail under Theme B',
          },
        ],
      },
    ],
  },
  {
    id: 'P2',
    type: 'pillar',
    code: 'P2',
    name: 'Pillar Two',
    description: 'High-level area 2',
    children: [
      {
        id: 'T2.1',
        type: 'theme',
        code: 'T2.1',
        name: 'Theme C',
        description: 'Theme under P2',
        children: [
          {
            id: 'ST2.1.1',
            type: 'subtheme',
            code: 'ST2.1.1',
            name: 'Sub-theme Delta',
            description: 'Detail under Theme C',
          },
        ],
      },
    ],
  },
]

// ------- Small UI helpers ----------------------------------------------------
function Caret({
  open,
  onClick,
  hidden,
}: {
  open: boolean
  onClick?: () => void
  hidden?: boolean
}) {
  if (hidden) {
    return <span style={{ display: 'inline-block', width: 18 }} />
  }
  return (
    <button
      onClick={onClick}
      aria-label={open ? 'Collapse' : 'Expand'}
      style={{
        cursor: 'pointer',
        width: 22,
        height: 22,
        borderRadius: 4,
        border: '1px solid #2d3742',
        background: '#0f1620',
        color: '#e6edf3',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
      }}
    >
      {open ? '▾' : '▸'}
    </button>
  )
}

function TypeTag({ type, code }: { type: RowType; code: string }) {
  const { bg, fg, label } = (() => {
    switch (type) {
      case 'pillar':
        return { bg: '#0b2a4a', fg: '#7cc4ff', label: 'Pillar' }
      case 'theme':
        return { bg: '#11331d', fg: '#7ee2a8', label: 'Theme' }
      default:
        return { bg: '#31210d', fg: '#f7c97f', label: 'Sub-theme' }
    }
  })()

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          background: bg,
          color: fg,
          padding: '2px 8px',
          borderRadius: 999,
          border: `1px solid ${fg}22`,
          fontSize: 12,
          lineHeight: 1.4,
        }}
      >
        {label}
      </span>
      <span style={{ fontSize: 12, color: '#9da7b1' }}>[{code}]</span>
    </div>
  )
}

function ActionButtons() {
  const btn = {
    base: {
      fontSize: 12,
      padding: '4px 8px',
      borderRadius: 6,
      border: '1px solid #33414f',
      background: '#111823',
      color: '#aab6c2',
      cursor: 'not-allowed' as const,
      opacity: 0.6,
    },
  }
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
      <button style={btn.base} title="Edit (disabled)">Edit</button>
      <button style={btn.base} title="Add (disabled)">Add</button>
      <button style={btn.base} title="Delete (disabled)">Delete</button>
    </div>
  )
}

// Flatten for rendering based on expansion
type FlatRow = {
  key: string
  depth: 0 | 1 | 2
  node: AnyNode
  hasChildren: boolean
}

function buildIndex(pillars: Pillar[]) {
  const byId = new Map<string, AnyNode>()
  const children = new Map<string, string[]>()

  for (const p of pillars) {
    byId.set(p.id, p)
    const tIds: string[] = []
    for (const t of p.children ?? []) {
      byId.set(t.id, t)
      tIds.push(t.id)
      const stIds: string[] = []
      for (const st of t.children ?? []) {
        byId.set(st.id, st)
        stIds.push(st.id)
      }
      if (stIds.length) children.set(t.id, stIds)
    }
    if (tIds.length) children.set(p.id, tIds)
  }

  const roots = pillars.map((p) => p.id)
  return { byId, children, roots }
}

export default function FrameworkPage() {
  // Expand/collapse state — keep it stable across renders
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())

  // Static data for now; we’ll swap to API later safely
  const data = useMemo(() => MOCK_DATA, [])

  const { byId, children, roots } = useMemo(() => buildIndex(data), [data])

  const toggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const flat: FlatRow[] = useMemo(() => {
    const out: FlatRow[] = []
    const pushNode = (id: string, depth: 0 | 1 | 2) => {
      const node = byId.get(id)!
      const childIds = children.get(id) ?? []
      out.push({
        key: id,
        depth,
        node,
        hasChildren: childIds.length > 0,
      })
      if (expanded.has(id)) {
        const nextDepth = (depth + 1) as 0 | 1 | 2
        for (const cid of childIds) pushNode(cid, nextDepth)
      }
    }
    for (const root of roots) pushNode(root, 0)
    return out
  }, [byId, children, roots, expanded])

  // Column widths in %, responsive
  const col = {
    caret: { width: '5%' },
    type: { width: '15%' },
    name: { width: '30%' },
    description: { width: '35%' },
    actions: { width: '15%' },
  } as const

  return (
    <div style={{ padding: '24px 28px' }}>
      {/* Title */}
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: 0.2 }}>
        Primary Framework Editor
      </h1>
      <p style={{ color: '#9DA7B1', marginTop: 6, marginBottom: 18 }}>
        Read-only mock. No database calls. We’ll wire actions after this stays stable.
      </p>

      {/* Table card */}
      <div
        style={{
          border: '1px solid #233040',
          borderRadius: 12,
          background: '#0f1620',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `${col.caret.width} ${col.type.width} ${col.name.width} ${col.description.width} ${col.actions.width}`,
            padding: '10px 12px',
            borderBottom: '1px solid #233040',
            background: '#0b121a',
            fontSize: 12,
            color: '#9DA7B1',
            textTransform: 'uppercase',
            letterSpacing: 0.8,
          }}
        >
          <div />
          <div>Type</div>
          <div>Name</div>
          <div>Description</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>

        {/* Body */}
        <div>
          {flat.map((row) => {
            const { node, depth, hasChildren } = row
            const leftPad = depth === 0 ? 0 : depth === 1 ? 18 : 36
            return (
              <div
                key={row.key}
                style={{
                  display: 'grid',
                  gridTemplateColumns: `${col.caret.width} ${col.type.width} ${col.name.width} ${col.description.width} ${col.actions.width}`,
                  padding: '10px 12px',
                  borderBottom: '1px solid #1b2531',
                  alignItems: 'center',
                  fontSize: 14,
                }}
              >
                {/* Caret */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ marginLeft: leftPad }}>
                    <Caret
                      open={expanded.has(node.id)}
                      onClick={
                        hasChildren ? () => toggle(node.id) : undefined
                      }
                      hidden={!hasChildren}
                    />
                  </div>
                </div>

                {/* Type + code */}
                <div>
                  <TypeTag type={node.type} code={node.code} />
                </div>

                {/* Name */}
                <div style={{ fontWeight: 600 }}>{node.name}</div>

                {/* Description */}
                <div style={{ color: '#aab6c2' }}>
                  {node.description ?? '—'}
                </div>

                {/* Actions (disabled) */}
                <div>
                  <ActionButtons />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
