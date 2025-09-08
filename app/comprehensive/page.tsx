// app/comprehensive/page.tsx
'use client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useEffect, useState } from 'react'

type FallbackStandard = {
  pillar_code: string
  pillar_name: string
  theme_code: string
  theme_name: string
  subtheme_code: string | null
  subtheme_name: string | null
}

type ViewRow = Record<string, any>

type ApiOk =
  | {
      ok: true
      mode: 'view'
      count: number
      items: ViewRow[]
    }
  | {
      ok: true
      mode: 'fallback-primary-only'
      counts: { pillars: number; themes: number; subthemes: number; standards: number }
      standards: FallbackStandard[]
    }

type ApiErr = { ok: false; message: string; [k: string]: any }

export default function ComprehensiveFrameworkPage() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<ApiOk | ApiErr | null>(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch('/comprehensive/api/list', { cache: 'no-store' })
        const json = (await res.json()) as ApiOk | ApiErr
        if (!alive) return
        setData(json)
      } catch (e: any) {
        if (!alive) return
        setData({ ok: false, message: e?.message ?? 'Network error' })
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Comprehensive Framework (read-only)</h1>
      <p className="text-sm text-gray-500 mb-6">
        This page reads from <code>comprehensive_items</code> if present. If not, it falls back to the Primary
        Framework (pillars/themes/subthemes) only. No edits yet.
      </p>

      {loading && <div className="text-gray-600">Loading…</div>}

      {!loading && data && data.ok === false && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="font-medium mb-1">Error</div>
          <div>{data.message}</div>
          {data.stage && <div className="mt-1 opacity-80">stage: {data.stage}</div>}
        </div>
      )}

      {!loading && data && data.ok === true && data.mode === 'fallback-primary-only' && (
        <div className="space-y-6">
          <div className="rounded-md border p-4">
            <div className="text-sm text-gray-700 mb-2">Counts</div>
            <ul className="text-sm text-gray-600 list-disc pl-5">
              <li>pillars: {data.counts.pillars}</li>
              <li>themes: {data.counts.themes}</li>
              <li>subthemes: {data.counts.subthemes}</li>
              <li>standards (rendered): {data.counts.standards}</li>
            </ul>
          </div>
          <div className="rounded-md border p-4">
            <div className="text-sm font-medium mb-2">Standards (lowest available depth)</div>
            <div className="text-xs text-gray-500 mb-3">
              Showing <b>{data.standards.length}</b> rows
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 pr-3">Pillar</th>
                    <th className="py-2 pr-3">Theme</th>
                    <th className="py-2 pr-3">Sub-theme</th>
                  </tr>
                </thead>
                <tbody>
                  {data.standards.map((s, i) => (
                    <tr key={`${s.pillar_code}-${s.theme_code}-${s.subtheme_code ?? 'none'}-${i}`} className="border-b">
                      <td className="py-2 pr-3">
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                          {s.pillar_code}
                        </span>{' '}
                        {s.pillar_name}
                      </td>
                      <td className="py-2 pr-3">
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                          {s.theme_code}
                        </span>{' '}
                        {s.theme_name}
                      </td>
                      <td className="py-2 pr-3">
                        {s.subtheme_code ? (
                          <>
                            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                              {s.subtheme_code}
                            </span>{' '}
                            {s.subtheme_name}
                          </>
                        ) : (
                          <span className="text-gray-400 italic">none</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!loading && data && data.ok === true && data.mode === 'view' && (
        <div className="space-y-6">
          <div className="rounded-md border p-4">
            <div className="text-sm text-gray-700 mb-2">
              Loaded <b>{data.count}</b> rows from <code>comprehensive_items</code>
            </div>
            <div className="text-xs text-gray-500">Showing first 100 rows for sanity.</div>
          </div>

          <div className="rounded-md border p-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-3">pillar_code</th>
                  <th className="py-2 pr-3">theme_code</th>
                  <th className="py-2 pr-3">subtheme_code</th>
                  <th className="py-2 pr-3">indicator_code</th>
                  <th className="py-2 pr-3">level_code</th>
                  <th className="py-2 pr-3">default_score</th>
                </tr>
              </thead>
              <tbody>
                {data.items.slice(0, 100).map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2 pr-3">{row.pillar_code}</td>
                    <td className="py-2 pr-3">{row.theme_code}</td>
                    <td className="py-2 pr-3">{row.subtheme_code ?? ''}</td>
                    <td className="py-2 pr-3">{row.indicator_code ?? ''}</td>
                    <td className="py-2 pr-3">{row.level_code ?? ''}</td>
                    <td className="py-2 pr-3">{row.default_score ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
