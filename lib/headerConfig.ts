// lib/headerConfig.ts
import { Info, Settings, Layers, Globe, Database } from "lucide-react";

export const toolkit = {
  title: "Shelter and Settlement Severity Classification Toolset",
  icon: Layers,
  color: "text-rust", // Tailwind rust color
};

export const groups = {
  dashboard: {
    name: "Dashboard",
    icon: Layers,
    color: "text-rust",
    pages: {
      index: {
        title: "SSC Dashboard",
        description:
          "Overview of all SSC tools, groups, and quick access to key functionality.",
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
          "Introduction to Shelter and Settlement Severity Classification, its purpose, and applications.",
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
    color: "text-amber-600",
    pages: {
      index: {
        title: "Country Configuration",
        description:
          "Configure country-level SSC settings and adjust parameters for specific contexts.",
      },
    },
  },
  instances: {
    name: "SSC Instances",
    icon: Database,
    color: "text-purple-600",
    pages: {
      index: {
        title: "SSC Instances",
        description:
          "Manage SSC instances across contexts, countries, and organizations.",
      },
    },
  },
} as const;
