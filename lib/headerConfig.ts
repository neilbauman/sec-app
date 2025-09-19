// lib/headerConfig.ts
import { Layers, Info, Settings, Globe, Server } from "lucide-react";

export const toolkit = {
  title: "Shelter and Settlement Severity Classification Toolset",
  icon: Layers,
  color: "text-brand-rust", // defined in tailwind.config.js
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
    color: "text-brand-blue",
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
        description: "Background and explanation of the SSC framework.",
      },
    },
  },
  configuration: {
    name: "Configuration",
    icon: Settings,
    color: "text-brand-green",
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
          "Manage and edit detailed framework elements, indicators, and relationships.",
      },
    },
  },
  country: {
    name: "Country Configuration",
    icon: Globe,
    color: "text-brand-blue",
    pages: {
      index: {
        title: "Country Configuration",
        description:
          "Set up country-specific settings and adapt the SSC framework to local contexts.",
      },
    },
  },
  instances: {
    name: "SSC Instances",
    icon: Server,
    color: "text-brand-green",
    pages: {
      index: {
        title: "SSC Instances",
        description:
          "Create and manage individual SSC instances for different contexts.",
      },
    },
  },
} as const;

// ✅ Type exports
export type GroupKey = keyof typeof groups;
export type PageKey<G extends GroupKey> = keyof (typeof groups)[G]["pages"];
