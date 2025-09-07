// app/framework/FrameworkClient.tsx
'use client';

import React from 'react';

export default function FrameworkClient() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>
        Primary Framework Editor
      </h1>
      <p style={{ marginTop: 8, opacity: 0.7 }}>
        Read-only placeholder — no Supabase calls yet.
      </p>
    </main>
  );
}
