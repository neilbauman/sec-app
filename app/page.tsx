// app/page.tsx
import PageHeader from "@/components/ui/PageHeader";
import { groups } from "@/lib/headerConfig";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader group="dashboard" page="index" breadcrumb={[]} />

      {/* Group Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(groups)
          .filter(([key]) => key !== "dashboard") // ✅ hide dashboard group itself
          .map(([key, group]) => {
            const GroupIcon = group.icon;
            return (
              <div
                key={key}
                className="p-6 rounded-xl shadow-md border bg-white transition hover:shadow-lg"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <GroupIcon className={`w-5 h-5 ${group.color}`} />
                  <h3 className={`text-lg font-semibold ${group.color}`}>
                    <Link href={`/${key}`}>{group.name}</Link>
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">{group.description}</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {Object.entries(group.pages).map(([pageKey, page]) => (
                    <li key={pageKey}>
                      <Link
                        href={`/${key}${pageKey === "index" ? "" : `/${pageKey}`}`}
                        className={`${group.color} hover:underline`}
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
      </div>
    </div>
  );
}
