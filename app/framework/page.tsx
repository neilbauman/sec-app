'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React, { useEffect, useMemo, useState } from 'react';
import { getBrowserClient } from '@/lib/supabaseBrowser';

type PillarRow = {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type ThemeRow = {
  id: number;
  pillar_id: number;         // FK → pillars.id
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type SubthemeRow = {
  id: number;
  theme_id: number;          // FK → themes.id
  code: string;
  name: string;
  description?: string | null;
  sort_order?: number | null;
};

type Expanded = {
  pillars: Set<number>;
  themes: Set<number>;
};

export default function PrimaryFrameworkEditor() {
  const supabase = useMemo(() => getBrowserClient(), []);
  const [loading, setLoading] = useState(true);
  const [pillars, setPillars] = useState<PillarRow[]>([]);
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [subs, setSubs] = useState<SubthemeRow[]>([]);
  const [expanded, setExpanded] = useState<Expanded>({
    pillars: new Set<number>(),
    themes: new Set<number>(),
  });

 
