// app/page.tsx
import Link from "next/link";
import { groups } from "@/lib/headerConfig";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-rust">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(groups).map(([key, group]) => (
          <div
            key={key}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
          >
            <div className="flex items-center space-x-3 mb-4">
              <group.icon className={`w-6 h-6 ${group.color}`} />
              <Link
                href={`/${key}`}
                className={`text-xl font-semibold hover:underline ${group.color}`}
              >
                {group.name}
              </Link>
            </div>
            <p className="text-gray-600 mb-3">{group.description}</p>
            <ul className="list-disc list-inside space-y-1">
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
        ))}
      </div>
    </div>
  );
}
