// components/PrimaryFrameworkEditorClient.tsx
"use client";

import { Database } from "@/types/supabase";
import PrimaryFrameworkCards from "./PrimaryFrameworkCards";

type Pillar = Database["public"]["Tables"]["pillars"]["Row"];
type Theme = Database["public"]["Tables"]["themes"]["Row"];
type Subtheme = Database["public"]["Tables"]["subthemes"]["Row"];
type Indicator = Database["public"]["Tables"]["indicators"]["Row"];

interface FrameworkData extends Pillar {
  themes: (Theme & {
    subthemes: (Subtheme & {
      indicators: Indicator[];
    })[];
  })[];
}

export default function PrimaryFrameworkEditorClient({
  data,
}: {
  data: FrameworkData[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6">
      {data.map((pillar) => (
        <PrimaryFrameworkCards key={pillar.id} pillar={pillar} />
      ))}
    </div>
  );
}
