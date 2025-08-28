'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const body = new FormData();
    body.append('file', file);

    setStatus('Uploading...');
    const res = await fetch('/api/import', {
      method: 'POST',
      headers: { 'x-admin-token': token },
      body
    });

    const text = await res.text();
    setStatus(`${res.ok ? '✅' : '❌'} ${text}`);
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Upload SSC Excel</h1>
      <form onSubmit={onSubmit}>
        <p>
          <label>Admin token:&nbsp;</label>
          <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Enter ADMIN_TOKEN" required />
        </p>
        <p>
          <input type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
        </p>
        <button type="submit">Upload</button>
      </form>
      {status && <p>{status}</p>}
    </main>
  );
}
