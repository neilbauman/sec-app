// app/framework/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0; // MUST be a number or false, never a function

import ClientFrameworkPage from './ClientFrameworkPage';

export default function FrameworkPage() {
  // server wrapper only — no hooks, no data fetching yet
  return <ClientFrameworkPage />;
}
