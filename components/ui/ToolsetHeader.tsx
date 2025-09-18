// ==============================
// components/ui/ToolsetHeader.tsx
// ==============================
"use client";

import { Layers } from "lucide-react";
import type { ReactNode } from "react";

export type Breadcrumb = {
  label: string;
  href?: string;
};

type ToolsetHeaderProps = {
  title: string;
  description?: string;
  group: string;
  groupIcon?: ReactNode;   // ✅ accepts JSX now
  icon?: ReactNode;        // ✅ accepts JSX now
  breadcrumbs: Breadcrumb[];
};

export default function ToolsetHeader({
  title,
  description,
  group,
  groupIcon,
  icon,
  breadcrumbs,
}: ToolsetHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-center gap-2">
        <Layers className="w-6 h-6 text-[#B7410E]" /> {/* Rust-colored */}
        <h1 className="text-xl font-bold">Shelter and Settlement Severity Classification Toolset</h1>
      </div>
      <div className="flex items-center gap-2 mt-1 text-lg font-semibold">
        {groupIcon}
        <span>{group}</span>
      </div>
      <div className="flex items-center gap-2 mt-1 text-base font-medium">
        {icon}
        <span>{title}</span>
      </div>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <nav className="mt-2 text-sm flex gap-2">
        {breadcrumbs.map((crumb, idx) => (
          <span key={idx} className="flex items-center gap-1">
            {crumb.href ? (
              <a
                href={crumb.href}
                className="text-[#B7410E] hover:underline"
              >
                {crumb.label}
              </a>
            ) : (
              <span className="font-bold text-[#B7410E]">{crumb.label}</span>
            )}
            {idx < breadcrumbs.length - 1 && <span>/</span>}
          </span>
        ))}
      </nav>
    </header>
  );
}

// ==============================
// app/page.tsx (Dashboard)
// ==============================
"use client";

import ToolsetHeader, { Breadcrumb } from "@/components/ui/ToolsetHeader";
import { Info, Cog, Globe, Database } from "lucide-react";

const breadcrumbs: Breadcrumb[] = [{ label: "Dashboard" }];

export default function DashboardPage() {
  return (
    <main className="p-6">
      <ToolsetHeader
        title="Dashboard"
        description="Navigate through the SSC toolset."
        group="Dashboard"
        groupIcon={<Info className="w-5 h-5 text-blue-600" />}
        breadcrumbs={breadcrumbs}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <a href="/about" className="p-4 border rounded-lg flex items-center gap-3 hover:bg-muted">
          <Info className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="font-semibold">About</h2>
            <p className="text-sm text-muted-foreground">Overview of the SSC toolset.</p>
          </div>
        </a>
        <a href="/configuration" className="p-4 border rounded-lg flex items-center gap-3 hover:bg-muted">
          <Cog className="w-6 h-6 text-green-600" />
          <div>
            <h2 className="font-semibold">SSC Configuration</h2>
            <p className="text-sm text-muted-foreground">Manage SSC frameworks and defaults.</p>
          </div>
        </a>
        <a href="/countries" className="p-4 border rounded-lg flex items-center gap-3 hover:bg-muted">
          <Globe className="w-6 h-6 text-orange-600" />
          <div>
            <h2 className="font-semibold">Country Configurations</h2>
            <p className="text-sm text-muted-foreground">Set up baseline country information.</p>
          </div>
        </a>
        <a href="/instances" className="p-4 border rounded-lg flex items-center gap-3 hover:bg-muted">
          <Database className="w-6 h-6 text-purple-600" />
          <div>
            <h2 className="font-semibold">SSC Instances</h2>
            <p className="text-sm text-muted-foreground">Perform calculations and manage data.</p>
          </div>
        </a>
      </div>
    </main>
  );
}

// ==============================
// app/about/page.tsx
// ==============================
"use client";

import ToolsetHeader, { Breadcrumb } from "@/components/ui/ToolsetHeader";
import { Info } from "lucide-react";

const breadcrumbs: Breadcrumb[] = [
  { label: "Dashboard", href: "/" },
  { label: "About" },
];

export default function AboutPage() {
  return (
    <main className="p-6">
      <ToolsetHeader
        title="About"
        description="Overview of the Shelter and Settlement Severity Classification toolset."
        group="About"
        groupIcon={<Info className="w-5 h-5 text-blue-600" />}
        icon={<Info className="w-5 h-5 text-blue-600" />}
        breadcrumbs={breadcrumbs}
      />
      <p className="mt-4">
        The SSC toolset provides a structured framework to classify and analyze shelter
        and settlement severity across contexts. It includes configuration tools,
        country-level baselines, and calculation modules.
      </p>
    </main>
  );
}

// ==============================
// app/configuration/page.tsx
// ==============================
"use client";

import ToolsetHeader, { Breadcrumb } from "@/components/ui/ToolsetHeader";
import { Cog, FileText } from "lucide-react";

const breadcrumbs: Breadcrumb[] = [
  { label: "Dashboard", href: "/" },
  { label: "Configuration" },
];

export default function ConfigurationPage() {
  return (
    <main className="p-6">
      <ToolsetHeader
        title="SSC Configuration"
        description="Manage the SSC global framework and defaults."
        group="Configuration"
        groupIcon={<Cog className="w-5 h-5 text-green-600" />}
        icon={<Cog className="w-5 h-5 text-green-600" />}
        breadcrumbs={breadcrumbs}
      />
      <div className="grid gap-2 mt-6">
        <a href="/configuration/primary" className="p-3 border rounded-md flex items-center gap-2 hover:bg-muted">
          <FileText className="w-5 h-5 text-green-600" />
          <span>Primary Framework Editor</span>
        </a>
        <a href="/configuration/comprehensive" className="p-3 border rounded-md flex items-center gap-2 hover:bg-muted">
          <FileText className="w-5 h-5 text-green-600" />
          <span>Comprehensive Framework Editor</span>
        </a>
      </div>
    </main>
  );
}

// ==============================
// app/configuration/primary/page.tsx
// ==============================
"use client";

import ToolsetHeader, { Breadcrumb } from "@/components/ui/ToolsetHeader";
import { Cog, FileText } from "lucide-react";
import PrimaryFrameworkEditorClient from "@/components/ui/PrimaryFrameworkEditorClient";

const breadcrumbs: Breadcrumb[] = [
  { label: "Dashboard", href: "/" },
  { label: "Configuration", href: "/configuration" },
  { label: "Primary Framework Editor" },
];

export default function PrimaryFrameworkPage() {
  return (
    <main className="p-6">
      <ToolsetHeader
        title="Primary Framework Editor"
        description="Manage the simplified SSC framework."
        group="Configuration"
        groupIcon={<Cog className="w-5 h-5 text-green-600" />}
        icon={<FileText className="w-5 h-5 text-green-600" />}
        breadcrumbs={breadcrumbs}
      />
      <PrimaryFrameworkEditorClient />
    </main>
  );
}

// ==============================
// app/configuration/comprehensive/page.tsx
// ==============================
"use client";

import ToolsetHeader, { Breadcrumb } from "@/components/ui/ToolsetHeader";
import { Cog, FileText } from "lucide-react";
import ComprehensiveFrameworkEditorClient from "@/components/ui/ComprehensiveFrameworkEditorClient";

const breadcrumbs: Breadcrumb[] = [
  { label: "Dashboard", href: "/" },
  { label: "Configuration", href: "/configuration" },
  { label: "Comprehensive Framework Editor" },
];

export default function ComprehensiveFrameworkPage() {
  return (
    <main className="p-6">
      <ToolsetHeader
        title="Comprehensive Framework Editor"
        description="Explore and manage the full SSC framework including indicators."
        group="Configuration"
        groupIcon={<Cog className="w-5 h-5 text-green-600" />}
        icon={<FileText className="w-5 h-5 text-green-600" />}
        breadcrumbs={breadcrumbs}
      />
      <ComprehensiveFrameworkEditorClient />
    </main>
  );
}
