// app/admin/framework/primary/editor/actions.ts
"use server";

import { revalidatePath } from "next/cache";

// Update entity name
export async function actionUpdateName(opts: {
  level: "pillar" | "theme" | "subtheme";
  code: string;
  name: string;
}) {
  // TODO: update DB
  revalidatePath("/admin/framework/primary/editor");
  return { ok: true as const };
}

// Update entity description
export async function actionUpdateDescription(opts: {
  level: "pillar" | "theme" | "subtheme";
  code: string;
  description: string;
}) {
  // TODO: update DB
  revalidatePath("/admin/framework/primary/editor");
  return { ok: true as const };
}

// Reorder entities
export async function actionReorder(opts: {
  level: "pillar" | "theme" | "subtheme";
  code: string;
  newSort: number; // ✅ fixed typo
}) {
  // TODO: update DB
  revalidatePath("/admin/framework/primary/editor");
  return { ok: true as const };
}

// Placeholder CSV import
export async function actionImportCsv(_formData: FormData) {
  // TODO: implement import
  revalidatePath("/admin/framework/primary/editor");
  return { ok: true as const };
}

// Placeholder CSV export
export async function actionExportCsv() {
  // TODO: implement export
  return { ok: true as const };
}
