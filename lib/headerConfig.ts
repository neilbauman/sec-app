import { Layers, Settings, Info, FileText } from "lucide-react";

export const toolkit = {
  title: "Shelter and Settlement Severity Classification Toolset",
  icon: <Layers className="w-6 h-6 text-rust" />,
};

export const groups = {
  configuration: {
    name: "SSC Configuration",
    icon: <Settings className="w-6 h-6 text-green-600" />,
    color: "text-green-600",
  },
  about: {
    name: "About",
    icon: <Info className="w-6 h-6 text-blue-500" />,
    color: "text-blue-500",
  },
};

export const pages = {
  primaryFramework: {
    name: "Primary Framework Editor",
    description:
      "Define and manage the global SSC framework including pillars, themes, and subthemes.",
    icon: <FileText className="w-6 h-6 text-green-600" />,
  },
  comprehensiveFramework: {
    name: "Comprehensive Framework Editor",
    description:
      "Manage and edit detailed framework elements, indicators, and relationships.",
    icon: <FileText className="w-6 h-6 text-green-600" />,
  },
  aboutToolset: {
    name: "About the SSC Toolset",
    description:
      "Learn about the SSC, its purpose, and how to use this toolset effectively.",
    icon: <Info className="w-6 h-6 text-blue-500" />,
  },
};
