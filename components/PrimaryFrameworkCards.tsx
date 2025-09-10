// components/PrimaryFrameworkCards.tsx
import { useMemo, useState } from "react";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

// NEW: centralize action types
type Entity = "pillar" | "theme" | "subtheme";
type Actions = {
  updateName: (entity: Entity, code: string, name: string) => Promise<void>;
  updateDescription: (entity: Entity, code: string, description: string) => Promise<void>;
  updateSort: (entity: Entity, code: string, sort: number) => Promise<void>;
  bumpSort: (entity: Entity, code: string, delta: number) => Promise<void>;
};

type Props = {
  defaultOpen?: boolean;
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
  // NEW: make actions optional
  actions?: Partial<Actions>;
};

export default function PrimaryFrameworkCards({
  defaultOpen = false,
  pillars,
  themes,
  subthemes,
  actions: actionsProp,
}: Props) {
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({});
  const [openThemes, setOpenThemes] = useState<Record<string, boolean>>({});

  // NEW: create safe defaults
  const noop = async () => {};
  const actions = useMemo<Actions>(() => {
    return {
      updateName: noop,
      updateDescription: noop,
      updateSort: noop,
      bumpSort: noop,
      ...actionsProp, // anything you pass in will override the defaults
    };
  }, [actionsProp]);

  // ...the rest of your component stays the same...
  // Make sure anywhere you previously used `props.actions.*`
  // you now call `actions.*` (this local constant).
}
