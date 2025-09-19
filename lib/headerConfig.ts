// lib/headerConfig.ts
import { Layers, Info, Settings, Globe, BarChart2 } from "lucide-react";

export const toolkit = {
  title: "Shelter and Settlement Severity Classification Toolset",
  icon: Layers,
  color: "text-brand-rust", // ✅ uses the muddy red defined in tailwind.config.js
};

export const groups = {
  dashboard: {
    name: "Dashboard",
    icon: Layers,
    color: "text-brand-rust",
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
        title: "What is SSC?",
        description:
          "Background on the SSC framework and its role in humanitarian response.",
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
      comprehensive: {
        title: "Comprehensive Framework Editor",
        description:
          "Manage detailed framework elements, indicators, and relationships.",
      },
    },
  },
  country: {
    name: "Country Configuration",
    icon: Globe,
    color: "text-purple-600",
    pages: {
      index: {
        title: "Country Configuration",
        description:
          "Manage SSC settings and framework customization for specific countries.",
      },
    },
  },
  instances: {
    name: "SSC Instances",
    icon: BarChart2,
    color: "text-orange-500",
    pages: {
      index: {
        title: "SSC Instances",
        description:
          "Create, manage, and explore SSC instances across contexts.",
      },
    },
  },
} as const;

export type GroupKey = keyof typeof groups;
export type PageKey<G extends GroupKey> = keyof (typeof groups)[G]["pages"];
