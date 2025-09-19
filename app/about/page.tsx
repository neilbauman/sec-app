// app/about/page.tsx
import Link from "next/link";
import { Info } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

export default function AboutIndex() {
  return (
    <div className="space-y-6">
      <PageHeader
        group="about"
        page="index"
        breadcrumb={[
          { label: "Dashboard", href: "/" },
          { label: "About" },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What is SSC? */}
        <Link
          href="/about/what-is-ssc"
          className="group block rounded-xl border border-gray-200 bg-white p-5 hover:shadow-sm transition"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-50 p-2">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:underline">
                What is SSC?
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Background on the SSC framework and its role in humanitarian response.
              </p>
            </div>
          </div>
        </Link>

        {/* Using the Toolset */}
        <Link
          href="/about/using"
          className="group block rounded-xl border border-gray-2 00 bg-white p-5 hover:shadow-sm transition"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-50 p-2">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:underline">
                Using the Toolset
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Guidelines and instructions for using the SSC toolset effectively.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
