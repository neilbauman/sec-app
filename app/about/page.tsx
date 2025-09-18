import ToolsetHeader from "@/components/ui/ToolsetHeader";
import { Info } from "lucide-react";

export default function AboutPage() {
  const breadcrumbs = [
    { label: "Dashboard", href: "/" },
    { label: "About" },
  ];

  return (
    <main className="p-6">
      <ToolsetHeader
        title="About the Toolset"
        description="Learn about the Shelter and Settlement Severity Classification (SSC) and how this toolset supports its use."
        group="About"
        icon={Info}
        breadcrumbs={breadcrumbs}
      />

      <div className="mt-6 space-y-4">
        <p>
          The Shelter and Settlement Severity Classification (SSC) provides a
          framework for assessing and analyzing the severity of shelter and
          settlement needs in crisis-affected populations.
        </p>
        <img
          src="/placeholder-diagram.png"
          alt="SSC Framework Diagram"
          className="rounded-lg shadow max-w-md"
        />
      </div>
    </main>
  );
}
