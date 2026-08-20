import { Plus, CircleUserRound } from "lucide-react";
import Link from "next/link";

import { UserEvents } from "@/components/event/userEvents";
import { Button } from "@/components/ui/button";
import { DashboardStats } from "@/app/(app)/dashboard/_components/dashboard-stats";
import { QuickAccess } from "@/app/(app)/dashboard/_components/quick-access";
import { AnalyticsPanel } from "@/app/(app)/dashboard/_components/analytics-panel";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams: Promise<{ tab?: string }>;
};

const tabs = [
  { value: "analytics", label: "Analytics" },
  { value: "my-events", label: "My stages" },
];

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  const activeTab = params.tab ?? "my-events";

  return (
    <main className="bg-[#FAF9F6]">
      <div className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10 ">
        <div className="flex flex-col gap-5 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mt-2 text-4xl font-black font-display md:text-2xl">
              Overview
            </h1>
          </div>

          <Link href="/dashboard/events/create">
            <Button variant="secondary">
              Create event
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* ── Quick data (client-fetched) ─────── */}
        <DashboardStats />

        {/* ── Quick access: circles & passes ─── */}
        <QuickAccess />

        <div className="mt-6 mb-8 flex items-center justify-between gap-2 border-b border-line">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <Link
                key={tab.value}
                href={`/dashboard?tab=${tab.value}`}
                className={`shrink-0 border-b-2 px-1 pb-2 text-sm font-bold uppercase tracking- transition ${
                  activeTab === tab.value
                    ? "border-turquoise text-foreground"
                    : "border-transparent text-neutral-400 hover:text-foreground"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
          {/* <Link href="/dashboard/circles" className="shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5">
              <CircleUserRound className="h-3.5 w-3.5" />
              Circles
            </Button>
          </Link> */}
        </div>

        {activeTab === "analytics" ? (
          <AnalyticsPanel />
        ) : (
          <section>
            <UserEvents />
          </section>
        )}
      </div>
    </main>
  );
}
