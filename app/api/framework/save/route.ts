// app/api/framework/save/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { NestedPillar } from "@/lib/framework-client";

export async function POST(req: Request) {
  const supabase = createClient();
  const { pillars }: { pillars: NestedPillar[] } = await req.json();

  try {
    // Clear existing data
    await supabase.from("subthemes").delete().neq("id", "");
    await supabase.from("themes").delete().neq("id", "");
    await supabase.from("pillars").delete().neq("id", "");

    // Insert pillars, themes, and subthemes
    for (const pillar of pillars) {
      const { id, name, description, sort_order } = pillar;
      await supabase.from("pillars").insert([{ id, name, description, sort_order }]);

      for (const theme of pillar.themes) {
        const { id: themeId, name, description, sort_order } = theme;
        await supabase.from("themes").insert([
          {
            id: themeId,
            theme_id: pillar.id, // ✅ FK to pillar
            name,
            description,
            sort_order,
          },
        ]);

        for (const sub of theme.subthemes) {
          const { id: subId, name, description, sort_order } = sub;
          await supabase.from("subthemes").insert([
            {
              id: subId,
              theme_id: theme.id, // ✅ FK to theme
              name,
              description,
              sort_order,
            },
          ]);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Save framework error:", err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
