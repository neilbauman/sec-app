'use server'

import { revalidatePath } from 'next/cache'
// If you already have DB helpers, import/use them here.
// For now these are safe stubs that no-op but keep types intact.

export async function actionUpdateName(opts: {
  level: 'pillar' | 'theme' | 'subtheme'
  code: string
  name: string
}) {
  // TODO: write to DB
  // await db.update...
  revalidatePath('/admin/framework/primary/editor')
  return { ok: true as const }
}

export async function actionUpdateDescription(opts: {
  level: 'pillar' | 'theme' | 'subtheme'
  code: string
  description: string
}) {
  // TODO: write to DB
  revalidatePath('/admin/framework/primary/editor')
  return { ok: true as const }
}

export async function actionReorder(opts: {
  level: 'pillar' | 'theme' | 'subtheme'
  code: string
  newSort: number
}) {
  // TODO: write to DB
  revalidatePath('/admin/framework/primary/editor')
  return { ok: true as const }
}

// Placeholders for future CSV bulk ops (non-functional for now)
export async function actionImportCsv(_formData: FormData) {
  // TODO: parse + apply
  revalidatePath('/admin/framework/primary/editor')
  return { ok: true as const }
}

export async function actionExportCsv() {
  // TODO: stream/export
  return { ok: true as const }
}
