// lib/headerConfig.ts
import {
  LayoutDashboard,
  Info,
  Settings,
  Globe,
  BarChart3,
} from "lucide-react";

export const toolkit = {
  title: "Shelter and Settlement Severity Classification Toolset",
  icon: LayoutDashboard,
  color: "text-brand-rust",
};

export const groups = {
  dashboard: {
    name: "Dashboard",
    icon: LayoutDashboard,
    color: "text-brand-rust",
    description: "Overview of all SSC tools and groups.",
    pages: {
      index: {
        title: "Dashboard",
        description: "Overview of all SSC tools and groups.",
      },
    },
  },
  about: {
    name: "About",
    icon: Info,
    color: "text-brand-blue",
    description: "Background and usage guidance for SSC.",
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
        title: "What is SSC?",
        description:
          "Definition, objectives, and conceptual framework of the SSC toolset.",
      },
    },
  },
  configuration: {
    name: "SSC Configuration",
    icon: Settings,
    color: "text-brand-green",
    description: "Manage and adjust the global configuration of the SSC toolset.",
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
    icon: Globe,
    color: "text-purple-600",
    description: "Set up and manage country-level SSC configurations.",
    pages: {
      index: {
        title: "Country Configuration",
        description:
          "Set up and manage country-level SSC configurations.",
      },
    },
  },
  instances: {
    name: "SSC Instances",
    icon: BarChart3,
    color: "text-orange-600",
    description: "Manage and analyze SSC instances across contexts.",
    pages: {
      index: {
        title: "SSC Instances",
        description: "Manage and analyze SSC instances across contexts.",
      },
    },
  },
} as const;

export type GroupKey = keyof typeof groups;
export type PageKey<G extends GroupKey> = keyof typeof groups[G]["pages"];
