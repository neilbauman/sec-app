// app/framework/page.tsx
// SERVER COMPONENT – config only, no React hooks here.

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import FrameworkClient from './FrameworkClient';

export default function FrameworkPage() {
  // Do NOT call any client-only code here.
  return <FrameworkClient />;
}
