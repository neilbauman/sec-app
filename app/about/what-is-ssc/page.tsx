"use client";

import PageHeader from "@/components/ui/PageHeader";

export default function WhatIsSSCPage() {
  return (
    <div className="space-y-6">
      <PageHeader group="about" page="whatIs" />
      <div className="prose max-w-none">
        <p>
          The <strong>Shelter and Settlement Severity Classification (SSC)</strong> is a framework
          designed to assess and compare the severity of shelter and settlement needs across
          different contexts. It enables organizations to prioritize resources, design
          interventions, and track progress over time.
        </p>
      </div>
    </div>
  );
}
