'use client'

import { useEffect, useState } from 'react'

type Totals = { pillars: number; themes: number; subthemes: number }

export default function FrameworkClient() {
  const [totals, setTotals] = useState<Totals | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        const res = await fetch('/framework/api/list', {
          cache: 'no-store', // disable browser/Next cache for this call
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!cancelled) {
          setTotals({
            pillars: json.pillars?.length ?? 0,
            themes: json.themes?.length ?? 0,
            subthemes: json.subthemes?.length ?? 0,
          })
        }
      } catch (e: any) {
        if (!cancelled) setErr(e?.message ?? 'Fetch failed')
      }
    }

    run()
    return () => { cancelled = true }
  }, [])

  return (
    <main style={{ padding: '2rem 1.25rem', maxWidth: 920 }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 24 }}>Primary Framework Editor</h1>

      <section style={{ lineHeight: 1.8 }}>
        <div>
          <strong>Pillars</strong>
          <div>{totals ? totals.pillars : '—'}</div>
        </div>
        <div style={{ marginTop: 12 }}>
          <strong>Themes</strong>
          <div>{totals ? totals.themes : '—'}</div>
        </div>
        <div style={{ marginTop: 12 }}>
          <strong>Sub-themes</strong>
          <div>{totals ? totals.subthemes : '—'}</div>
        </div>
      </section>

      <p style={{ marginTop: 24, color: '#444' }}>
        Read-only scaffold. No Supabase or client hooks here beyond a single fetch; data comes from <code>/framework/api/list</code>.
        We’ll layer interactivity later.
      </p>

      {err && (
        <p style={{ marginTop: 16, color: 'crimson' }}>
          Error: {err}
        </p>
      )}
    </main>
  )
}
