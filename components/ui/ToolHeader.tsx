// /components/ui/ToolHeader.tsx
import { Layers } from "lucide-react";

interface ToolHeaderProps {
  title: string;
  group: "Configuration" | "Instances"; // expand later if needed
}

export function ToolHeader({ title, group }: ToolHeaderProps) {
  return (
    <div className="flex items-center space-x-3 mb-6">
      <Layers
        className={`h-6 w-6 ${
          group === "Configuration"
            ? "text-green-600"
            : group === "Instances"
            ? "text-blue-600"
            : "text-gray-600"
        }`}
      />
      <h1 className="text-2xl font-semibold">{title}</h1>
    </div>
  );
}
