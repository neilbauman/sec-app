// components/ui/ToolHeader.tsx
import { Layers, Cog, Globe, Database } from "lucide-react"

export type ToolGroup = "dashboard" | "configuration" | "instances" | "country"

interface ToolHeaderProps {
  pageTitle: string
  pageDescription: string
  breadcrumbs: { label: string; href?: string }[]
  group: ToolGroup
}

export default function ToolHeader({
  pageTitle,
  pageDescription,
  breadcrumbs,
  group,
}: ToolHeaderProps) {
  const iconMap: Record<ToolGroup, JSX.Element> = {
    dashboard: <Layers className="w-6 h-6 text-blue-500" />,
    configuration: <Cog className="w-6 h-6 text-green-500" />,
    country: <Globe className="w-6 h-6 text-purple-500" />,
    instances: <Database className="w-6 h-6 text-red-500" />,
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        {iconMap[group]}
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
      </div>
      <p className="text-gray-600">{pageDescription}</p>
      <nav className="text-sm text-gray-500">
        {breadcrumbs.map((crumb, i) => (
          <span key={i}>
            {crumb.href ? (
              <a href={crumb.href} className="hover:underline text-blue-600">
                {crumb.label}
              </a>
            ) : (
              <span>{crumb.label}</span>
            )}
            {i < breadcrumbs.length - 1 && " > "}
          </span>
        ))}
      </nav>
    </div>
  )
}
