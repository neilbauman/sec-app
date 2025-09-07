// app/framework/ClientFrameworkPage.tsx
'use client';

import React from 'react';

export default function ClientFrameworkPage() {
  return (
    <main style={{ padding: '24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
        Primary Framework Editor
      </h1>
      <p style={{ opacity: 0.8 }}>
        (Placeholder) – UI coming next. This page is intentionally client-only and
        performs no Supabase calls yet, just to confirm clean deploys.
      </p>
    </main>
  );
}
