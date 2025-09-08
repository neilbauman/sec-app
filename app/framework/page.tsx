// Server component wrapper that renders the client component.
// No data fetching here, no `revalidate`, no `dynamic` flags.

import ClientFrameworkPage from './ClientFrameworkPage';

export default function Page() {
  return <ClientFrameworkPage />;
}
