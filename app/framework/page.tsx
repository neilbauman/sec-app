// app/framework/page.tsx
import FrameworkClient from './FrameworkClient';

export const dynamic = 'force-dynamic'; // stay dynamic to avoid any accidental SSG

export default function FrameworkPage() {
  return <FrameworkClient />;
}
