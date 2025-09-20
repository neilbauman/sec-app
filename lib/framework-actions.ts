// Placeholder actions for DB wiring later

export async function addPillar(data: any) {
  console.log("Add pillar", data);
  return Promise.resolve();
}

export async function editPillar(id: string, updates: any) {
  console.log("Edit pillar", id, updates);
  return Promise.resolve();
}

export async function deletePillar(id: string) {
  console.log("Delete pillar", id);
  return Promise.resolve();
}

export async function addTheme(pillarId: string, data: any) {
  console.log("Add theme under pillar", pillarId, data);
  return Promise.resolve();
}

export async function deleteTheme(id: string) {
  console.log("Delete theme", id);
  return Promise.resolve();
}

export async function addSubtheme(themeId: string, data: any) {
  console.log("Add subtheme under theme", themeId, data);
  return Promise.resolve();
}

export async function deleteSubtheme(id: string) {
  console.log("Delete subtheme", id);
  return Promise.resolve();
}
