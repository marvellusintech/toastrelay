import { BarChart3, CalendarCheck, Gift, Images, Users } from "lucide-react";
import Link from "next/link";

import { EventCard } from "@/components/reuseables/event_card";
import { StatTile } from "@/components/reuseables/stat_tile";
import { demoEvents, demoGuests, demoMoments, demoToasts } from "@/lib/demo_data";

type DashboardPageProps = {
  searchParams: Promise<{ tab?: string }>;
};

const tabs = [
  { value: "my-stages", label: "My stages" },
  { value: "discover", label: "Discover" },
  { value: "analytics", label: "Analytics" },
  { value: "circles", label: "Circles" },
];

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const activeTab = params.tab ?? "my-stages";

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
      <div className="flex flex-col gap-5 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-muted">Host console</p>
          <h1 className="mt-2 text-4xl font-black tracking-normal md:text-5xl">Dashboard</h1>
        </div>
        <Link
          href="/events/new"
          className="inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-black text-background transition hover:bg-foreground/85"
        >
          <CalendarCheck className="h-4 w-4" />
          Create stage
        </Link>
      </div>

      <section className="grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={CalendarCheck} label="Stages" value={String(demoEvents.length)} />
        <StatTile icon={Users} label="Guests" value={String(demoGuests.length)} tone="coral" />
        <StatTile icon={Gift} label="Toasts" value={String(demoToasts.length)} tone="gold" />
        <StatTile icon={Images} label="Moments" value={String(demoMoments.length)} />
      </section>

      <div className="mb-8 flex gap-2 overflow-x-auto border-b border-line">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/dashboard?tab=${tab.value}`}
            className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-black uppercase tracking-[0.18em] transition ${
              activeTab === tab.value
                ? "border-turquoise text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {activeTab === "analytics" ? (
        <section className="rounded-lg border border-line bg-panel p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-coral" />
            <h2 className="text-xl font-black">Event pulse</h2>
          </div>
          <div className="mt-6 grid h-64 items-end gap-4 sm:grid-cols-4">
            {[72, 48, 64, 38].map((height, index) => (
              <div key={height} className="flex h-full flex-col justify-end gap-3">
                <div
                  className="rounded-t-md bg-turquoise"
                  style={{ height: `${height}%` }}
                />
                <p className="text-center text-xs font-bold text-muted">W{index + 1}</p>
              </div>
            ))}
          </div>
        </section>
      ) : activeTab === "circles" ? (
        <section className="rounded-lg border border-line bg-panel p-6 shadow-sm">
          <h2 className="text-xl font-black">Guest circles</h2>
          <p className="mt-3 max-w-2xl leading-7 text-muted">
            Family, friends, VIPs, and event-specific access groups will live here once
            the backend circle endpoints are connected.
          </p>
        </section>
      ) : (
        <section className="grid gap-6 md:grid-cols-2">
          {demoEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </section>
      )}
    </main>
  );
}
