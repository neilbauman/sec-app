'use client';
import SubthemeList from './SubthemeList';

export default function ThemeList() {
  // TODO: fetch themes from Supabase and map them here
  return (
    <div className="ml-4">
      <h3 className="text-lg font-medium">Themes</h3>
      <div className="border p-2 rounded bg-gray-50">
        {/* Example placeholder */}
        <div className="p-2 border-b">Theme 1.1: Physical Safety</div>
        <SubthemeList />
      </div>
    </div>
  );
}
