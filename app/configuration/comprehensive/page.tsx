// /app/configuration/comprehensive/page.tsx
import { ToolHeader } from "@/components/ui/ToolHeader";

export default function ComprehensiveFrameworkPage() {
  return (
    <div>
      <ToolHeader
        title="Comprehensive Framework Editor"
        group="Configuration" // ✅ must be capitalized
      />
      <p className="text-gray-600">
        Comprehensive editor functionality coming soon.
      </p>
    </div>
  );
}
