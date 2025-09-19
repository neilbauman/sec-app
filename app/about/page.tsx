'use client';

import PageHeader from '@/components/ui/PageHeader';
import { Info } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="p-4 space-y-4">
      <PageHeader
        toolkitTitle="Shelter and Settlement Severity Classification Toolset"
        group={{
          name: 'About',
          icon: <Info className="w-5 h-5 text-blue-600" />,
          color: 'text-blue-600',
        }}
        page={{
          title: 'About the SSC Toolset',
          description:
            'Overview of the Shelter and Settlement Severity Classification toolset.',
          icon: <Info className="w-6 h-6 text-blue-600" />, // match group color
        }}
        breadcrumb={[
          { label: 'Dashboard', href: '/' },
          { label: 'About' },
        ]}
      />

      <p className="text-gray-700">
        The Shelter and Settlement Severity Classification (SSC) Toolset provides a
        structured framework for analyzing humanitarian needs. It helps ensure
        consistent and comparable results across countries and contexts.
      </p>

      <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-md text-gray-400">
        [Placeholder diagram/image]
      </div>
    </div>
  );
}
