// /lib/headerConfig.ts
import { Layers, Settings, Info } from "lucide-react";

export const toolkit = {
  title: "Shelter and Settlement Severity Classification Toolset",
  icon: Layers, // store component, not JSX
  color: "text-orange-600",
};

export const groups = {
  configuration: {
    name: "SSC Configuration",
    icon: Settings,
    color: "text-green-600",
  },
  about: {
    name: "About",
    icon: Info,
    color: "text-blue-500",
  },
};
