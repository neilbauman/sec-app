'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

function ThemeRow({ theme /* ...existing props */ }) {
  const router = useRouter()
  const [busy, setBusy] = React.useState(false)

  const nudge = async (direction: 'up' | 'down') => {
    if (busy) return
    setBusy(true)
    try {
      await fetch('/admin/framework/api/theme/sort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: theme.code, direction }),
      })
      router.refresh() // re-fetch server data
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="...">
      {/* ...your existing content... */}
      <div className="flex items-center gap-2">
        <button
          disabled={busy}
          onClick={() => nudge('up')}
          className="icon-button"
          aria-label="Move up"
        >
          ↑
        </button>
        <button
          disabled={busy}
          onClick={() => nudge('down')}
          className="icon-button"
          aria-label="Move down"
        >
          ↓
        </button>
        {/* edit / add / delete will go here next */}
      </div>
    </div>
  )
}
