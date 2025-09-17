import PageHeader from '@/components/ui/PageHeader'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import Link from 'next/link'

export default function FrameworkPage() {
  const frameworks = [
    {
      name: 'Primary Framework',
      description: 'Configure pillars, themes, and sub-themes.',
      href: '/framework/primary',
    },
    // In the future you could add { name: 'Comprehensive Framework', href: '/framework/comprehensive', ... }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Frameworks"
        subtitle="Browse and manage available frameworks."
      />

      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Frameworks', href: '/framework' },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {frameworks.map((fw) => (
          <Link
            key={fw.name}
            href={fw.href}
            className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold">{fw.name}</h3>
            <p className="mt-2 text-sm text-gray-600">{fw.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
