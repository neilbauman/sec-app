// app/framework/ClientFrameworkPage.tsx
'use client';

import { useState } from 'react';

export default function ClientFrameworkPage() {
  const [dummy] = useState(false); // harmless hook to ensure client-boundary

  return (
    <main style={{ padding: '24px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>
        Primary Framework Editor
      </h1>
      <p style={{ color: '#555' }}>
        (Read-only stub — no data fetching yet)
      </p>
    </main>
  );
}
