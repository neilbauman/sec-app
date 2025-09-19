"use client";

import PageHeader from "@/components/ui/PageHeader";

export default function UsingPage() {
  return (
    <div className="space-y-6">
      <PageHeader group="about" page="using" />
      <div className="prose max-w-none">
        <p>
          This section provides practical guidance on how to navigate, configure, and apply the SSC
          toolset effectively in different contexts. Step-by-step instructions and tips will help
          users get started quickly.
        </p>
      </div>
    </div>
  );
}
