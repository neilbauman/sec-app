// lib/headerConfig.ts
import { Layers, Settings, Info, FileText } from "lucide-react";

export const toolkit = {
  title: "Shelter and Settlement Severity Classification Toolset",
  icon: Layers,
  color: "text-orange-600",
};

export const groups = {
  configuration: {
    name: "SSC Configuration",
    icon: Settings,
    color: "text-green-600",
    pages: {
      index: {
        title: "SSC Configuration",
        description:
          "Manage configuration settings and access framework editors.",
      },
      primary: {
        title: "Primary Framework Editor",
        description:
          "Define and manage pillars, themes, and subthemes of the SSC framework.",
        icon: FileText,
      },
      comprehensive: {
        title: "Comprehensive Framework Editor",
        description: "Work with the complete SSC framework in detail.",
        icon: FileText,
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
        description: "Guidance on how to use the SSC toolset effectively.",
      },
      "what-is-ssc": {
        title: "What is the SSC?",
        description: "Information on what the SSC is, its purpose, and context.",
      },
    },
  },
};

export type GroupKey = keyof typeof groups;
export type PageKey<G extends GroupKey> = keyof typeof groups[G]["pages"];
