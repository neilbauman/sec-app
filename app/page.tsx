// app/page.tsx
import PageHeader from "@/components/ui/PageHeader";
import { groups } from "@/lib/headerConfig";

const dashboardGroups: (keyof typeof groups)[] = [
  "about",
  "configuration",
  "country",
  "instances",
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader group="dashboard" page="index" breadcrumb={[{ label: "Dashboard" }]} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboardGroups.map((key) => {
          const group = groups[key];
          return (
            <div
              key={key}
              className="border rounded-xl p-4 shadow-sm bg-white flex flex-col"
            >
              <div className="flex items-center gap-2 mb-2">
                <group.icon className={`w-6 h-6 ${group.color}`} />
                <a
                  href={`/${key}`}
                  className={`text-lg font-semibold ${group.color} hover:underline`}
                >
                  {group.name}
                </a>
              </div>
              <p className="text-gray-600 mb-3">{group.description}</p>
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(group.pages).map(([pageKey, page]) => (
                  <li key={pageKey}>
                    <a
                      href={`/${key}/${pageKey === "index" ? "" : pageKey}`}
                      className={`${group.color} hover:underline`}
                    >
                      {page.title}
                    </a>
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
