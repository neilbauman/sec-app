// /lib/framework.ts
import { createClient } from '@/lib/supabase';
import type { FrameworkList, Pillar, Theme, Subtheme } from '@/types/framework';

export async function fetchFrameworkList(): Promise<FrameworkList> {
  const supabase = createClient();

  const [{ data: pillars, error: pErr }, { data: themes, error: tErr }, { data: subthemes, error: sErr }] =
    await Promise.all([
      supabase.from('pillars').select('*').order('sort_order', { ascending: true }).order('name', { ascending: true }),
      supabase.from('themes').select('*').order('sort_order', { ascending: true }).order('name', { ascending: true }),
      supabase.from('subthemes').select('*').order('sort_order', { ascending: true }).order('name', { ascending: true }),
    ]);

  if (pErr) throw pErr;
  if (tErr) throw tErr;
  if (sErr) throw sErr;

  return {
    pillars: (pillars ?? []) as Pillar[],
    themes: (themes ?? []) as Theme[],
    subthemes: (subthemes ?? []) as Subtheme[],
  };
}

// ------- Mutations (rename + sort) -------

type Entity = 'pillar' | 'theme' | 'subtheme';

function tableFor(entity: Entity) {
  if (entity === 'pillar') return 'pillars';
  if (entity === 'theme') return 'themes';
  return 'subthemes';
}

export async function updateName(entity: Entity, code: string, name: string) {
  const supabase = createClient();
  const table = tableFor(entity);
  const { error } = await supabase.from(table).update({ name }).eq('code', code);
  if (error) throw error;
}

export async function updateDescription(entity: Entity, code: string, description: string | null) {
  const supabase = createClient();
  const table = tableFor(entity);
  const { error } = await supabase.from(table).update({ description }).eq('code', code);
  if (error) throw error;
}

export async function updateSort(entity: Entity, code: string, sort_order: number) {
  const supabase = createClient();
  const table = tableFor(entity);
  const { error } = await supabase.from(table).update({ sort_order }).eq('code', code);
  if (error) throw error;
}

// Convenience: bump sort by +/-1
export async function bumpSort(entity: Entity, code: string, delta: number) {
  const supabase = createClient();
  const table = tableFor(entity);

  const { data, error } = await supabase.from(table).select('sort_order').eq('code', code).maybeSingle();
  if (error) throw error;
  const current = (data?.sort_order ?? 0) as number;
  const next = Math.max(0, current + delta);
  const { error: e2 } = await supabase.from(table).update({ sort_order: next }).eq('code', code);
  if (e2) throw e2;
}
