import dynamic from 'next/dynamic';
const FrameworkEditor = dynamic(() => import('@/components/framework/FrameworkEditor'), { ssr: false });

export default function PrimaryFrameworkPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
      <p className="text-gray-600">Manage Pillars, Themes, and Subthemes. Ref codes are computed from sort order.</p>
      <FrameworkEditor />
    </div>
  );
}
