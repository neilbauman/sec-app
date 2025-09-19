// app/configuration/page.tsx
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { groups } from "@/lib/headerConfig";

export default function ConfigurationIndexPage() {
  const cfg = groups.configuration;

  const cards = [
    {
      key: "primary",
      href: "/configuration/primary",
      title: cfg.pages.primary.title,
      description: cfg.pages.primary.description,
    },
    {
      key: "comprehensive",
      href: "/configuration/comprehensive",
      title: cfg.pages.comprehensive.title,
      description: cfg.pages.comprehensive.description,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader group="configuration" page="index" />

      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((c) => (
          <div
            key={c.key}
            className="rounded-xl border shadow-sm hover:shadow-md transition bg-white p-5"
          >
            <h3 className={`text-lg font-semibold ${cfg.color}`}>
              <Link href={c.href} className="hover:underline">
                {c.title}
              </Link>
            </h3>
            <p className="text-gray-600 mt-1">{c.description}</p>
            <ul className="list-disc list-inside mt-3">
              <li>
                <Link href={c.href} className={`${cfg.color} hover:underline`}>
                  {c.title}
                </Link>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
