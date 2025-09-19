'use client';
import { createClient } from '@/lib/supabase-browser';
import type { FrameworkTree, Pillar } from '@/types/framework';

/**
 * Fetch full nested hierarchy: Pillars -> Themes -> Subthemes
 * Ordered by sort_order at each level
 */
export async function getFrameworkTree(): Promise<FrameworkTree> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('pillars')
    .select(`
      id, name, description, sort_order,
      themes:themes (
        id, pillar_id, name, description, sort_order,
        subthemes:subthemes (
          id, theme_id, name, description, sort_order
        )
      )
    `)
    .order('sort_order', { ascending: true })
    .order('sort_order', { ascending: true, foreignTable: 'themes' })
    .order('sort_order', { ascending: true, foreignTable: 'themes.subthemes' });

  if (error) throw error;

  return { pillars: (data as Pillar[]) ?? [] };
}

export async function addPillar(input: { name: string; description?: string }) {
  const supabase = createClient();
  // Determine next sort_order
  const { data: maxData } = await supabase
    .from('pillars')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);
  const nextOrder = (maxData?.[0]?.sort_order ?? 0) + 1;

  const { data, error } = await supabase
    .from('pillars')
    .insert({ name: input.name, description: input.description ?? null, sort_order: nextOrder })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addTheme(pillarId: string, input: { name: string; description?: string }) {
  const supabase = createClient();
  const { data: maxData } = await supabase
    .from('themes')
    .select('sort_order')
    .eq('pillar_id', pillarId)
    .order('sort_order', { ascending: false })
    .limit(1);
  const nextOrder = (maxData?.[0]?.sort_order ?? 0) + 1;

  const { data, error } = await supabase
    .from('themes')
    .insert({ pillar_id: pillarId, name: input.name, description: input.description ?? null, sort_order: nextOrder })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addSubtheme(themeId: string, input: { name: string; description?: string }) {
  const supabase = createClient();
  const { data: maxData } = await supabase
    .from('subthemes')
    .select('sort_order')
    .eq('theme_id', themeId)
    .order('sort_order', { ascending: false })
    .limit(1);
  const nextOrder = (maxData?.[0]?.sort_order ?? 0) + 1;

  const { data, error } = await supabase
    .from('subthemes')
    .insert({ theme_id: themeId, name: input.name, description: input.description ?? null, sort_order: nextOrder })
    .select()
    .single();
  if (error) throw error;
  return data;
}
