// lib/headerConfig.ts
import { Info, Settings, Globe, BarChart3, LayoutDashboard } from "lucide-react";

export type PageInfo = {
  title: string;
  description: string;
};

export type GroupInfo = {
  name: string;
  icon: any;
  color: string;
  description: string;
  pages: Record<string, PageInfo>;
};

export const toolkit = {
  name: "Shelter and Settlement Severity Classification Toolset",
  icon: LayoutDashboard,
};

export const groups: Record<string, GroupInfo> = {
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
    color: "text-blue-600",
    description: "Background and usage guidance for SSC.",
    pages: {
      index: {
        title: "About the SSC Toolset",
        description: "Learn about the SSC, its purpose, and how to use this toolset effectively.",
      },
      "what-is-ssc": {
        title: "What is SSC?",
        description: "Background on the SSC framework and its role in humanitarian response.",
      },
      using: {
        title: "Using the Toolset",
        description: "Guidelines and instructions for using the SSC toolset effectively.",
      },
    },
  },
  configuration: {
    name: "SSC Configuration",
    icon: Settings,
    color: "text-green-600",
    description: "Manage and adjust the global configuration of the SSC toolset.",
    pages: {
      index: {
        title: "SSC Configuration",
        description: "Manage SSC configuration and access framework editors.",
      },
      primary: {
        title: "Primary Framework Editor",
        description: "Define and manage pillars, themes, and subthemes of the SSC framework.",
      },
      comprehensive: {
        title: "Comprehensive Framework Editor",
        description: "Manage detailed framework elements, indicators, and relationships.",
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
        description: "Configure SSC for specific countries.",
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
        description: "Access and manage SSC instances across contexts.",
      },
    },
  },
};

export type GroupKey = keyof typeof groups;
export type PageKey<G extends GroupKey> = keyof typeof groups[G]["pages"];
