// app/framework/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// This file is a Server Component by default.
// It only wraps the client UI to ensure the route is fully dynamic.
import ClientFrameworkPage from './ClientFrameworkPage';

export default function FrameworkPage() {
  return <ClientFrameworkPage />;
}
