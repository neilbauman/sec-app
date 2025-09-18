import { Layers, Info, Cog, Globe, Database } from "lucide-react";

export const toolsetGroups = {
  about: {
    label: "About",
    color: "text-blue-600",
    icon: Info,
  },
  configuration: {
    label: "Configuration",
    color: "text-green-600",
    icon: Cog,
  },
  country: {
    label: "Country Configurations",
    color: "text-purple-600",
    icon: Globe,
  },
  instances: {
    label: "SSC Instances",
    color: "text-orange-600",
    icon: Database,
  },
};
