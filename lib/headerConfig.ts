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
          "Manage configuration tools, including editors and versioning for the SSC framework.",
      },
      primary: {
        title: "Primary Framework Editor",
        description:
          "Define and manage pillars, themes, and subthemes of the SSC framework.",
      },
      comprehensive: {
        title: "Comprehensive Framework Editor",
        description:
          "Advanced editing and versioning of the SSC framework (future).",
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
        description: "Background and explanation of the SSC framework.",
      },
    },
  },
};
