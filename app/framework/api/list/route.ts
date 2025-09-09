import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Mock data. Replace later with a DB client call.
  return NextResponse.json({
    pillars: [
      { code: "P1", name: "Shelter" },
      { code: "P2", name: "WASH" }
    ],
    themes: [
      { code: "T1", name: "Living Conditions", pillar: "P1" },
      { code: "T2", name: "Safety", pillar: "P1" },
      { code: "T3", name: "Access", pillar: "P2" }
    ],
    subthemes: [
      { code: "S1", name: "Habitability", theme: "T1" },
      { code: "S2", name: "Overcrowding", theme: "T1" },
      { code: "S3", name: "Protection", theme: "T2" },
      { code: "S4", name: "Water Points", theme: "T3" }
    ]
  });
}
