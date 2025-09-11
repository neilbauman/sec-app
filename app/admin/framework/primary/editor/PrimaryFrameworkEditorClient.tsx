"use client";

import React from "react";
import { Pillar } from "@/types/framework";
import PrimaryFrameworkCards from "@/components/PrimaryFrameworkCards";

type Props = {
  pillars: Pillar[];
  error?: string;
};

export default function PrimaryFrameworkEditorClient({ pillars, error }: Props) {
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-md">
        <p className="font-medium">Error loading framework data</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!pillars || pillars.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-sm border rounded-md">
        No framework data found.
      </div>
    );
  }

  return <PrimaryFrameworkCards pillars={pillars} />;
}
