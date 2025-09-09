'use client'

import React from 'react'

type Pillar = { code: string; name: string; description?: string; sort_order: number }
type Theme = { code: string; pillar_code: string; name: string; description?: string; sort_order: number }
type Subtheme = { code: string; theme_code: string; name: string; description?: string; sort_order: number }

export default function PrimaryEditorTable(props: {
  pillars: Pillar[]
  themesByPillar: Map<string, Theme[]>
  subsByTheme: Map<string, Subtheme[]>
}) {
  const { pillars, themesByPillar, subsByTheme } = props

  // expanded state per pillar and theme
  const [openPillars, setOpenPillars] = React.useState<Record<string, boolean>>({})
  const [openThemes, setOpenThemes] = React.useState<Record<string, boolean>>({})

  const togglePillar = (code: string) =>
    setOpenPillars((s) => ({ ...s, [code]: !s[code] }))
  const toggleTheme = (code: string) =>
    setOpenThemes((s) => ({ ...s, [code]: !s[code] }))

  const Btn = ({
    open,
    onClick,
    label,
  }: {
    open: boolean
    onClick: () => void
    label: string
  }) => (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md px-1.5 py-0.5 hover:bg-gray-50"
      aria-expanded={open}
      aria-label={label}
      title={label}
    >
      <span className="tabular-nums">{open ? '▾' : '▸'}</span>
    </button>
  )

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-600">
            <th className="px-4 py-3 text-left w-[220px]">Type / Code</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left w-[520px]">Description</th>
            <th className="px-4 py-3 text-right w-[80px]">Sort</th>
            <th className="px-4 py-3 text-right w-[120px]">Actions</th>
          </tr>
        </thead>

        <tbody>
          {pillars
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((p) => {
              const pOpen = openPillars[p.code] ?? true // default open
              const themes = (themesByPillar.get(p.code) ?? []).slice().sort((a, b) => a.sort_order - b.sort_order)

              return (
                <React.Fragment key={p.code}>
                  {/* PILLAR ROW (group header with caret + blue tag) */}
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-2">
                        <Btn open={pOpen} onClick={() => togglePillar(p.code)} label="Toggle pillar" />
                        <LevelBadge color="blue">Pillar</LevelBadge>
                        <CodeSmall>{p.code}</CodeSmall>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium">{p.name}</div>
                    </td>
                    <td className="px-4 py-3 align-top text-gray-700">{p.description}</td>
                    <td className="px-4 py-3 align-top text-right tabular-nums">{p.sort_order}</td>
                    <td className="px-4 py-3 align-top">
                      <ActionsDisabled />
                    </td>
                  </tr>

                  {/* THEMES (collapsible) */}
                  {pOpen &&
                    themes.map((t) => {
                      const tOpen = openThemes[t.code] ?? true
                      const subs = (subsByTheme.get(t.code) ?? [])
                        .slice()
                        .sort((a, b) => a.sort_order - b.sort_order)

                      return (
                        <React.Fragment key={t.code}>
                          <tr className="border-t border-gray-200">
                            <td className="px-4 py-3 align-top">
                              <div className="flex items-center">
                                <div style={{ width: 24 }} />
                                <Btn open={tOpen} onClick={() => toggleTheme(t.code)} label="Toggle theme" />
                                <LevelBadge color="green">Theme</LevelBadge>
                                <CodeSmall>{t.code}</CodeSmall>
                              </div>
                            </td>
                            <td className="px-4 py-3 align-top">
                              <div className="font-medium">{t.name}</div>
                            </td>
                            <td className="px-4 py-3 align-top text-gray-700">{t.description}</td>
                            <td className="px-4 py-3 align-top text-right tabular-nums">{t.sort_order}</td>
                            <td className="px-4 py-3 align-top">
                              <ActionsDisabled />
                            </td>
                          </tr>

                          {/* SUBTHEMES (collapsible under theme) */}
                          {tOpen &&
                            subs.map((s) => (
                              <tr key={s.code} className="border-t border-gray-200">
                                <td className="px-4 py-3 align-top">
                                  <div className="flex items-center">
                                    <div style={{ width: 48 }} />
                                    {/* no caret at leaf */}
                                    <LevelBadge color="red">Subtheme</LevelBadge>
                                    <CodeSmall>{s.code}</CodeSmall>
                                  </div>
                                </td>
                                <td className="px-4 py-3 align-top">
                                  <div className="font-medium">{s.name}</div>
                                </td>
                                <td className="px-4 py-3 align-top text-gray-700">{s.description}</td>
                                <td className="px-4 py-3 align-top text-right tabular-nums">{s.sort_order}</td>
                                <td className="px-4 py-3 align-top">
                                  <ActionsDisabled />
                                </td>
                              </tr>
                            ))}
                        </React.Fragment>
                      )
                    })}
                </React.Fragment>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}

function LevelBadge({
  color,
  children,
}: {
  color: 'blue' | 'green' | 'red'
  children: React.ReactNode
}) {
  const styles =
    color === 'blue'
      ? 'bg-blue-100 text-blue-700 border-blue-200'
      : color === 'green'
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-red-100 text-red-700 border-red-200'
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${styles}`}
    >
      {children}
    </span>
  )
}

function CodeSmall({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] text-gray-500 ml-2">[{children}]</span>
}

function ActionsDisabled() {
  const btn =
    'inline-flex items-center rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-400'
  return (
    <div className="flex justify-end gap-1">
      <button className={btn} disabled title="Edit (coming soon)">
        ✎
      </button>
      <button className={btn} disabled title="Delete (coming soon)">
        🗑
      </button>
      <button className={btn} disabled title="Move up (coming soon)">
        ↑
      </button>
      <button className={btn} disabled title="Move down (coming soon)">
        ↓
      </button>
      <button className={btn} disabled title="Add child (coming soon)">
        ＋
      </button>
    </div>
  )
}
