import PageHeader from '@/components/ui/PageHeader'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import PrimaryFrameworkEditorClient from '@/components/ui/PrimaryFrameworkEditorClient'

export default function PrimaryFrameworkPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Primary Framework"
        subtitle="Configure pillars, themes, and sub-themes."
      />

      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Frameworks', href: '/framework' },
          { label: 'Primary Framework', href: '/framework/primary' },
        ]}
      />

      <PrimaryFrameworkEditorClient />
    </div>
  )
}
