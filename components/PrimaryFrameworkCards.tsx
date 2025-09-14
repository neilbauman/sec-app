// components/PrimaryFrameworkCards.tsx
"use client";

import type { FrameworkData } from "@/types/framework";

interface Props {
  pillar: FrameworkData;
}

export default function PrimaryFrameworkCards({ pillar }: Props) {
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-2">{pillar.name}</h2>
      <p className="text-gray-600">{pillar.description}</p>
    </div>
  );
}
