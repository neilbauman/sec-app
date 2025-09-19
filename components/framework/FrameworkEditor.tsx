// components/framework/FrameworkEditor.tsx
export default function FrameworkEditor() {
  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold">Primary Framework Editor</h2>
      <p className="text-gray-700">
        This is a non-interactive placeholder while we restore the full editor.
        No database calls, just static UI to keep deployments stable.
      </p>

      <div className="border rounded-md p-4">
        <h3 className="font-semibold">Example structure (non-interactive)</h3>
        <ul className="mt-2 list-disc list-inside space-y-1">
          <li>
            <strong>Pillar:</strong> Shelter
            <ul className="list-disc list-inside ml-5">
              <li>Theme: Materials & Construction</li>
              <li>Theme: Durability & Safety</li>
            </ul>
          </li>
          <li>
            <strong>Pillar:</strong> Settlement
            <ul className="list-disc list-inside ml-5">
              <li>Theme: Site Planning</li>
              <li>Theme: Community Spaces</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
