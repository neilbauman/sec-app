import { Layers, Settings, Info, FileText } from "lucide-react";

export const toolkit = {
  title: "Shelter and Settlement Severity Classification Toolset",
  icon: <Layers className="w-6 h-6 text-orange-600" />,
  color: "text-orange-600",
};

export const groups = {
  configuration: {
    name: "SSC Configuration",
    icon: <Settings className="w-6 h-6 text-green-600" />,
    color: "text-green-600",
    pages: {
      primaryFramework: {
        title: "Primary Framework Editor",
        description:
          "Define and manage the global SSC framework including pillars, themes, and subthemes.",
        icon: <FileText className="w-6 h-6 text-green-600" />,
      },
      comprehensiveFramework: {
        title: "Comprehensive Framework Editor",
        description:
          "Manage and edit detailed framework elements, indicators, and relationships.",
        icon: <FileText className="w-6 h-6 text-green-600" />,
      },
    },
  },
  about: {
    name: "About",
    icon: <Info className="w-6 h-6 text-blue-500" />,
    color: "text-blue-500",
    pages: {
      using: {
        title: "Using this Toolset",
        description:
          "Guidance on how to navigate and apply the SSC toolset in practice.",
        icon: <FileText className="w-6 h-6 text-blue-500" />,
      },
      whatIs: {
        title: "What is the SSC?",
        description:
          "An introduction to the Shelter and Settlement Severity Classification system and its purpose.",
        icon: <FileText className="w-6 h-6 text-blue-500" />,
      },
    },
  },
};
