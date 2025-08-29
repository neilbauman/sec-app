'use client'

import React from 'react'
import { Table, Input, Button, Tag, Space, App } from 'antd'
import type { ColumnsType } from 'antd/es/table'

type Level = 'pillar' | 'theme' | 'subtheme' | 'standard'

type Node = {
  key: string
  level: Level
  pillar: any | null
  theme: any | null
  subtheme: any | null
  standard: any | null
  indicator: { id: string; name: string; description: string | null } | null
  children?: Node[]
}

const tint = {
  pillar: 'rgba(241,236,231,0.70)',
  theme:  'rgba(232,233,238,0.65)',
  subtheme:'rgba(233,240,248,0.65)',
  standard:'transparent',
}

export default function Home() {
  const { message } = App.useApp()
  const [search, setSearch] = React.useState('')
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<React.Key[]>([]) // default collapsed
  const [editMode, setEditMode] = React.useState(false)
  const [data, setData] = React.useState<Node[]>([])
  const [loading, setLoading] = React.useState(false)
  const [draft, setDraft] = React.useState<Record<string, { name?: string; description?: string }>>({})

  const load = React.useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/framework', { cache: 'no-store' })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Load failed')
      setData(j.tree as Node[])
    } catch (e: any) {
      message.error(e.message || 'Load failed')
    } finally {
      setLoading(false)
    }
  }, [message])

  React.useEffect(() => { load() }, [load])

  const descFor = (n: Node) =>
    n.level === 'pillar' ? (n.pillar?.description ?? '') :
    n.level === 'theme' ? (n.theme?.description ?? '') :
    n.level === 'subtheme' ? (n.subtheme?.description ?? '') :
    n.standard?.description ?? ''

  const nameForLevel = (n: Node) =>
    n.level === 'pillar' ? n.pillar?.name :
    n.level === 'theme' ? n.theme?.name :
    n.level === 'subtheme' ? n.subtheme?.name :
    (n.standard ? 'Standard' : '')

  const filtered = React.useMemo(() => {
    if (!search.trim()) return data
    const q = search.toLowerCase()

    const walk = (nodes: Node[]): Node[] => nodes.map(node => {
      const text = [
        node.pillar?.name, node.theme?.name, node.subtheme?.name,
        descFor(node), node.indicator?.name, node.indicator?.description
      ].filter(Boolean).join(' ').toLowerCase()
      const matched = text.includes(q)
      const kids = node.children ? walk(node.children).filter(Boolean) : []
      if (matched || kids.length) return { ...node, children: kids }
      return null as any
    }).filter(Boolean)

    return walk(data)
  }, [data, search])

  async function saveIndicator(id: string, values: { name?: string; description?: string }) {
    const res = await fetch(`/api/indicators/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    const j = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(j.error || 'Save failed')
  }
  async function deleteIndicator(id: string) {
    const res = await fetch(`/api/indicators/${id}`, { method: 'DELETE' })
    const j = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(j.error || 'Delete failed')
  }
  async function addIndicatorFor(node: Node) {
    const payload: any = {
      code: null,
      name: draft.__new__?.name || `Default indicator for ${nameForLevel(node) || node.level}`,
      description: draft.__new__?.description || '',
      is_default: true, weight: null, sort_order: 1,
    }
    if (node.level === 'pillar') payload.pillar_id = node.pillar?.id
    else if (node.level === 'theme') payload.theme_id = node.theme?.id
    else if (node.level === 'subtheme') payload.subtheme_id = node.subtheme?.id
    else if (node.level === 'standard') payload.standard_id = node.standard?.id
    const res = await fetch('/api/indicators', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    })
    const j = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(j.error || 'Create failed')
  }

  const columns: ColumnsType<Node> = [
    {
      title: 'Pillar',
      dataIndex: 'pillar',
      key: 'pillar',
      render: (_val, node) => node.pillar ? (
        <Space size="small">
          <Tag>P</Tag>
          <strong>{node.pillar.name}</strong>
        </Space>
      ) : null,
    },
    {
      title: 'Theme',
      dataIndex: 'theme',
      key: 'theme',
      render: (_val, node) => node.theme ? (
        <Space size="small">
          <Tag>T</Tag>
          {node.theme.name}
        </Space>
      ) : null,
    },
    {
      title: 'Sub-theme',
      dataIndex: 'subtheme',
      key: 'subtheme',
      render: (_val, node) => node.subtheme ? (
        <Space size="small">
          <Tag>ST</Tag>
          {node.subtheme.name}
        </Space>
      ) : null,
    },
    {
      title: 'Description',
      key: 'description',
      render: (_val, node) => descFor(node),
      width: 360,
    },
    {
      title: 'Indicator Name',
      key: 'indicator_name',
      width: 260,
      render: (_val, node) => {
        const id = node.indicator?.id
        if (!editMode || !id) return node.indicator?.name ?? <span style={{ color: '#6b7280' }}>—</span>
        const d = draft[id]?.name ?? node.indicator?.name ?? ''
        return (
          <Input
            size="small"
            value={d}
            onChange={e => setDraft(f => ({ ...f, [id]: { ...(f[id] || {}), name: e.target.value } }))}
            placeholder="Indicator name"
          />
        )
      },
    },
    {
      title: 'Indicator Description',
      key: 'indicator_desc',
      width: 360,
      render: (_val, node) => {
        const id = node.indicator?.id
        if (!editMode || !id) return node.indicator?.description ?? <span style={{ color: '#6b7280' }}>—</span>
        const d = draft[id]?.description ?? node.indicator?.description ?? ''
        return (
          <Input.TextArea
            autoSize={{ minRows: 1, maxRows: 4 }}
            value={d}
            onChange={e => setDraft(f => ({ ...f, [id]: { ...(f[id] || {}), description: e.target.value } }))}
            placeholder="Indicator description"
          />
        )
      },
    },
    {
      title: '',
      key: 'actions',
      width: 160,
      render: (_val, node) => {
        const id = node.indicator?.id
        if (!editMode) return null
        return id ? (
          <Space>
            <Button
              size="small"
              onClick={async () => {
                try {
                  const patch = {
                    name: draft[id]?.name ?? node.indicator?.name ?? '',
                    description: draft[id]?.description ?? node.indicator?.description ?? '',
                  }
                  await saveIndicator(id, patch)
                  setDraft(f => ({ ...f, [id]: {} }))
                  await load()
                } catch (e: any) { message.error(e.message) }
              }}
            >Save</Button>
            <Button
              size="small"
              danger
              onClick={() => {
                if (!confirm('Delete indicator from this row?')) return
                deleteIndicator(id!).then(load).catch((e)=>message.error(e.message))
              }}
            >Delete</Button>
          </Space>
        ) : (
          <Button
            size="small"
            type="dashed"
            onClick={async () => {
              try { await addIndicatorFor(node); await load() }
              catch (e: any) { message.error(e.message) }
            }}
          >
            Add indicator
          </Button>
        )
      },
    },
  ]

  return (
    <App>
      <div style={{ padding: 20, maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <h1 style={{ margin: 0, fontSize: 20 }}>Framework Table</h1>
          <div style={{ flex: 1 }} />
          <a href="/api/export" style={{ color: '#4f46e5' }}>Download CSV</a>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" checked={editMode} onChange={e => setEditMode(e.target.checked)} /> Edit mode
          </label>
          <Input.Search
            placeholder="Search across names, descriptions, indicators…"
            allowClear
            onSearch={setSearch}
            style={{ width: 360 }}
          />
          <Button onClick={() => setExpandedRowKeys([])}>Collapse all</Button>
          <Button onClick={() => {
            const keys = (filtered || []).map(n => n.key)
            setExpandedRowKeys(keys)
          }}>Expand all</Button>
        </div>

        <Table<Node>
          rowKey="key"
          loading={loading}
          columns={columns}
          dataSource={filtered}
          pagination={false}
          expandable={{
            expandedRowKeys,
            onExpandedRowsChange: setExpandedRowKeys,
          }}
          rowClassName={(rec) => `lvl-${rec.level}`}
          style={{ background: 'white' }}
        />

        <style jsx global>{`
          .lvl-pillar > td { background: ${tint.pillar}; }
          .lvl-theme > td { background: ${tint.theme}; }
          .lvl-subtheme > td { background: ${tint.subtheme}; }
        `}</style>
      </div>
    </App>
  )
}
