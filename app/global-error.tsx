'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('Global error boundary:', error);
  return (
    <html>
      <body style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
        <h1 style={{ fontSize: 24, marginBottom: 12 }}>Application Error</h1>
        <p style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
          {error.message}
          {error.stack ? '\n\n' + error.stack : ''}
        </p>
        <button
          onClick={() => reset()}
          style={{
            marginTop: 16,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #ddd',
            cursor: 'pointer',
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
