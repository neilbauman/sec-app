'use client';
import ThemeList from './ThemeList';

export default function PillarList() {
  // TODO: fetch pillars from Supabase and map them here
  return (
    <div>
      <h2 className="text-xl font-semibold">Pillars</h2>
      <div className="border p-2 rounded bg-white shadow-sm">
        {/* Example placeholder */}
        <div className="p-2 border-b">Pillar 1: The Shelter</div>
        <ThemeList />
      </div>
    </div>
  );
}
