// /lib/breadcrumbs.ts
import { Home, Info, Cog } from "lucide-react";

export type Breadcrumb = {
  label: string;
  href: string;
  icon?: React.ElementType;
};

export function makeBreadcrumbs(path: string[]): Breadcrumb[] {
  const map: Record<string, Breadcrumb> = {
    dashboard: { label: "Dashboard", href: "/", icon: Home },
    about: { label: "About", href: "/about", icon: Info },
    configuration: { label: "Configuration", href: "/configuration", icon: Cog },
    primary: { label: "Primary Editor", href: "/configuration/primary" },
    comprehensive: { label: "Comprehensive Editor", href: "/configuration/comprehensive" },
    // country: { label: "Country Configs", href: "/countries" },
    // instances: { label: "SSC Instances", href: "/instances" },
  };

  return path.map((key) => map[key]).filter(Boolean);
}
