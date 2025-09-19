// lib/headerConfig.ts
import { Info, Settings, Map, Layers } from "lucide-react";

export const toolkit = {
  title: "Shelter and Settlement Severity Classification Toolset",
  icon: Layers, // icon component
  color: "text-brand-rust", // ✅ new rust color
};

export const groups = {
  about: {
    name: "About",
    icon: Info,
    color: "text-blue-600",
    pages: {
      index: {
        title: "About the SSC Toolset",
        description:
          "Learn about the SSC, its purpose, and how to use this toolset effectively.",
      },
      using: {
        title: "Using this Toolset",
        description:
          "Guidelines and instructions for using the SSC toolset effectively.",
      },
    },
  },
  configuration: {
    name: "Configuration",
    icon: Settings,
    color: "text-green-600",
    pages: {
      index: {
        title: "SSC Configuration",
        description:
          "Manage and adjust the global configuration of the SSC toolset.",
      },
      primary: {
        title: "Primary Framework Editor",
        description:
          "Define and manage pillars, themes, and subthemes of the SSC framework.",
      },
    },
  },
  dashboard: {
    name: "Dashboard",
    icon: Layers,
    color: "text-brand-rust",
    pages: {
      index: {
        title: "Dashboard",
        description:
          "Overview of all SSC tools and groups.",
      },
    },
  },
} as const;

export type GroupKey = keyof typeof groups;
export type PageKey<G extends GroupKey> = keyof (typeof groups)[G]["pages"];
