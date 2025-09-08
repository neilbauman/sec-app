// app/comprehensive/page.tsx

import { headers } from 'next/headers';
import ComprehensiveClient from './ComprehensiveClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ComprehensivePage() {
  const h = headers();
  const host =
    h.get('x-forwarded-host') ??
    h.get('host') ??
    process.env.VERCEL_URL ??
    'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const baseUrl = `${proto}://${host}`;

  return <ComprehensiveClient baseUrl={baseUrl} />;
}
