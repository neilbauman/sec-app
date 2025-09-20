// /lib/framework-actions.ts
// Safe stubbed actions for now (just console.log). Later we’ll wire to Supabase.

//
// Pillars
//
export async function addPillar(data: {
  name: string;
  description: string;
  sort_order: number;
}) {
  console.log("Stub: add pillar", data);
  return Promise.resolve();
}

export async function editPillar(
  id: string,
  updates: { name: string; description: string; sort_order: number }
) {
  console.log("Stub: edit pillar", id, updates);
  return Promise.resolve();
}

export async function deletePillar(id: string) {
  console.log("Stub: delete pillar", id);
  return Promise.resolve();
}

//
// Themes
//
export async function addTheme(
  pillarId: string,
  data: { name: string; description: string; sort_order: number }
) {
  console.log("Stub: add theme under pillar", pillarId, data);
  return Promise.resolve();
}

export async function editTheme(
  id: string,
  updates: { name: string; description: string; sort_order: number }
) {
  console.log("Stub: edit theme", id, updates);
  return Promise.resolve();
}

export async function deleteTheme(id: string) {
  console.log("Stub: delete theme", id);
  return Promise.resolve();
}

//
// Subthemes
//
export async function addSubtheme(
  themeId: string,
  data: { name: string; description: string; sort_order: number }
) {
  console.log("Stub: add subtheme under theme", themeId, data);
  return Promise.resolve();
}

export async function editSubtheme(
  id: string,
  updates: { name: string; description: string; sort_order: number }
) {
  console.log("Stub: edit subtheme", id, updates);
  return Promise.resolve();
}

export async function deleteSubtheme(id: string) {
  console.log("Stub: delete subtheme", id);
  return Promise.resolve();
}
