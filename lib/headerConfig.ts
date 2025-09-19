// lib/headerConfig.ts
import type { LucideIcon } from "lucide-react";
import {
  Layers,
  Info,
  Settings,
  Globe,
  BarChart3,
} from "lucide-react";

// Toolkit (title + icon color is the muddy rust)
export const toolkit = {
  title:
    "Shelter and Settlement Severity Classification Toolset",
  icon: Layers as LucideIcon,
  color: "text-brand-rust", // from tailwind config
} as const;

// Groups + pages (icons are component refs, not JSX)
export const groups = {
  dashboard: {
    name: "Dashboard",
    icon: Layers as LucideIcon,
    color: "text-brand-rust",
    pages: {
      index: {
        title: "Dashboard",
        description:
          "Overview of all SSC tools and groups.",
      },
    },
  },

  about: {
    name: "About",
    icon: Info as LucideIcon,
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
      "what-is-ssc": {
        title: "What is the SSC?",
        description: "High-level overview and background.",
      },
    },
  },

  configuration: {
    name: "Configuration",
    icon: Settings as LucideIcon,
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

  country: {
    name: "Country Configuration",
    icon: Globe as LucideIcon,
    color: "text-purple-600",
    pages: {
      index: {
        title: "Country Configuration",
        description:
          "Manage countries and related settings.",
      },
    },
  },

  instances: {
    name: "SSC Instances",
    icon: BarChart3 as LucideIcon,
    color: "text-orange-600",
    pages: {
      index: {
        title: "SSC Instances",
        description:
          "Create and manage SSC instances.",
      },
    },
  },
} as const;

export type GroupKey = keyof typeof groups;
