// /lib/headerConfig.tsx
import { Layers, Settings, Info } from "lucide-react";

export const toolkit = {
  title: "Shelter and Settlement Severity Classification Toolset",
  icon: <Layers className="w-7 h-7 text-orange-600" />,
  color: "text-orange-600",
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
