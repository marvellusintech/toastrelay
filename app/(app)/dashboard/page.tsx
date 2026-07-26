import {
  BarChart3,
  CalendarCheck,
  Eye,
  Gift,
  Images,
  Plus,
  Ticket,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";

import { UserEvents } from "@/components/event/userEvents";

import { EventCard } from "@/components/reuseables/event_card";
import { StatTile } from "@/components/reuseables/stat_tile";
import {
  demoEvents,
  demoGuests,
  demoMoments,
  demoToasts,
} from "@/lib/demo_data";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type DashboardPageProps = {
  searchParams: Promise<{ tab?: string }>;
};

const tabs = [
    { value: "analytics", label: "Analytics" },
  { value: "my-events", label: "My stages" },
  // { value: "discover", label: "Discover" },

  { value: "circles", label: "Circles" },
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
            <h1 className="mt-2 text-4xl font-black font-display  md:text-2xl">
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

        <section className="grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile
            icon={CalendarCheck}
            label="Total Events"
            value={String(demoEvents.length)}
          />
          <StatTile
            icon={Eye}
            label="Event Views"
            value={String(demoGuests.length)}
            tone="coral"
          />
          <StatTile
            icon={Ticket}
            label="Tickets Sold"
            value={String(demoToasts.length)}
            tone="gold"
          />
          <StatTile
            icon={Wallet}
            label="Revenue"
            value={String(demoMoments.length)}
          />
        </section>

        <div className="mt-6 mb-8 flex gap-2 overflow-x-auto border-b border-line">
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

        {activeTab === "analytics" ? (
          <Card className="px-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-coral" />
              <h2 className="text-xl font-semibold">Event pulse</h2>
            </div>
            <div className="mt-6 grid h-64 items-end gap-4 sm:grid-cols-4">
              {[72, 48, 64, 38].map((height, index) => (
                <div
                  key={height}
                  className="flex h-full flex-col justify-end gap-3"
                >
                  <div
                    className="rounded-t-md bg-turquoise"
                    style={{ height: `${height}%` }}
                  />
                  <p className="text-center text-xs font-bold text-muted">
                    W{index + 1}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        ) : activeTab === "circles" ? (
          <section className="rounded-lg border border-line bg-panel p-6 shadow-sm">
            <h2 className="text-xl font-black">Guest circles</h2>
            <p className="mt-3 max-w-2xl leading-7 text-muted">
              Family, friends, VIPs, and event-specific access groups will live
              here once the backend circle endpoints are connected.
            </p>
          </section>
        ) : (
          <section>
            {/* {demoEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))} */}

            <UserEvents />
          </section>
        )}
      </div>
    </main>
  );
}
