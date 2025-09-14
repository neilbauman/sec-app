// app/framework/primary/editor/PrimaryFrameworkEditorClient.tsx
"use client";

import { useState } from "react";
import type { Pillar } from "@/types/pillar";
import PrimaryFrameworkCards from "./PrimaryFrameworkCards";

interface Props {
  pillars: Pillar[];
}

export default function PrimaryFrameworkEditorClient({ pillars }: Props) {
  const [localPillars] = useState(pillars);

  return <PrimaryFrameworkCards pillars={localPillars} />;
}
