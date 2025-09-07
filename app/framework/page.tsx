// app/framework/page.tsx
'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React from 'react';

export default function FrameworkPage(): JSX.Element {
  return (
    <main style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
        Primary Framework Editor
      </h1>
      <p style={{ color: '#666' }}>
        (Display-only placeholder — no data calls yet.)
      </p>
    </main>
  );
}
