// app/comprehensive/page.tsx
import React from 'react'

const buildOrigin = () => {
  // Prefer VERCEL URLs in production
  if (process.env.VERCEL_URL) {
    // Vercel provides values without scheme
    return `https://${process.env.VERCEL_URL}`
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  return 'http://localhost:3000'
}

export default async function ComprehensivePage() {
  const origin = buildOrigin()

  let status = 0
  let json: any = null

  try {
    const res = await fetch(`${origin}/comprehensive/api/list`, {
      // This page always calls the internal API (Option A)
      headers: {
        'X-Internal-Token': process.env.INTERNAL_API_TOKEN ?? '',
        'Accept': 'application/json',
      },
      // Disable static caching – we want fresh reads (and to avoid prerender)
      cache: 'no-store',
      next: { revalidate: 0 },
    })
    status = res.status
    json = await res.json()
  } catch (e: any) {
    json = { ok: false, message: e?.message ?? 'Fetch failed' }
    status = 500
  }

  if (!json?.ok) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Comprehensive Framework (read-only)</h1>
        <p>Failed to load comprehensive framework data.</p>
        {status ? <p><strong>HTTP {status}</strong></p> : null}
        <p>You can also inspect the raw endpoint at <code>/comprehensive/api/list</code>.</p>
      </div>
    )
  }

  const counts = json.counts ?? {}
  const sample = Array.isArray(json.sample) ? json.sample[0] : (json.sample ?? null)

  return (
    <div style={{ padding: 24, lineHeight: 1.45 }}>
      <h1>Comprehensive Framework (read-only)</h1>

      <ul>
        <li>Pillars: {counts.pillars ?? 0}</li>
        <li>Themes: {counts.themes ?? 0}</li>
        <li>Sub-themes: {counts.subthemes ?? 0}</li>
        <li>Indicators: {counts.indicators ?? 0}</li>
        <li>Levels: {counts.levels ?? 0}</li>
        <li>Criteria: {counts.criteria ?? 0}</li>
      </ul>

      <h2>Sample rows</h2>
      <pre style={{ background: '#f6f7f9', padding: 16, borderRadius: 8, overflowX: 'auto' }}>
{JSON.stringify(sample ?? { pillar:null, theme:null, indicator:null, level:null, criterion:null }, null, 2)}
      </pre>

      <p style={{ marginTop: 16 }}>
        Data is fetched from <code>/comprehensive/api/list</code>. Once these counts/samples look correct,
        we’ll layer in the rich UI.
      </p>
    </div>
  )
}
