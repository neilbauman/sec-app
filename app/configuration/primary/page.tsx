import FrameworkEditor from '@/components/framework/FrameworkEditor';

export default function PrimaryFrameworkPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Primary Framework Editor</h1>
      <p className="text-gray-600">Manage Pillars, Themes, and Subthemes here.</p>
      <FrameworkEditor />
    </div>
  );
}
