// app/page.tsx
"use client";

import { Layers } from "lucide-react";
import { Card, CardContent } from "@/components/Card";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* ✅ App Header with Icon */}
      <div className="flex items-center space-x-3">
        <Layers className="w-8 h-8 text-gray-700" />
        <h1 className="text-2xl font-bold">
          Shelter and Settlements Severity Index Tool
        </h1>
      </div>

      {/* ✅ About Section */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-gray-700">
            Welcome to the Shelter and Settlements Severity Index Tool. Use this
            dashboard to manage and edit your framework.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
