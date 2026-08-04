"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, Loader2, Ticket, Users, Wallet } from "lucide-react";

import { getAnalyticsSummaryApi } from "@/lib/api/user";
import { queryKeys } from "@/lib/api/query_keys";
import { StatTile } from "@/components/reuseables/stat_tile";
import { formatCurrency } from "@/lib/utils";

export function DashboardStats() {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.analytics.summary(),
    queryFn: () => getAnalyticsSummaryApi(),
  });

  const summary = data?.data;

  const containerClass =
    "flex gap-4 overflow-x-auto py-8 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:[scrollbar-width:auto] lg:grid-cols-4";

  if (isLoading) {
    return (
      <section className={containerClass}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[120px] w-[240px] shrink-0 animate-pulse rounded-lg border border-line bg-panel sm:w-auto"
          />
        ))}
      </section>
    );
  }

  if (isError || !summary) {
    return (
      <section className={containerClass}>
        <StatTile
          icon={CalendarCheck}
          label="Total Events"
          value={summary ? String(summary.totalEvents ?? 0) : "—"}
          tone="turquoise"
          className="w-[240px] sm:w-auto"
        />
        <StatTile
          icon={Users}
          label="Total RSVPs"
          value={summary ? String(summary.totalRsvps ?? 0) : "—"}
          tone="coral"
          className="w-[240px] sm:w-auto"
        />
        <StatTile
          icon={Ticket}
          label="Tickets Sold"
          value={summary ? String(summary.ticketsSold ?? 0) : "—"}
          tone="gold"
          className="w-[240px] sm:w-auto"
        />
        <StatTile
          icon={Wallet}
          label="Revenue"
          value={summary ? formatCurrency(summary.totalRevenue ?? 0) : "—"}
          className="w-[240px] sm:w-auto"
        />
      </section>
    );
  }

  return (
    <section className={containerClass}>
      <StatTile
        icon={CalendarCheck}
        label="Total Events"
        value={String(summary.totalEvents ?? 0)}
        tone="turquoise"
        className="w-[240px] sm:w-auto"
      />
      <StatTile
        icon={Users}
        label="Total RSVPs"
        value={String(summary.totalRsvps ?? 0)}
        tone="coral"
        className="w-[240px] sm:w-auto"
      />
      <StatTile
        icon={Ticket}
        label="Tickets Sold"
        value={String(summary.ticketsSold ?? 0)}
        tone="gold"
        className="w-[240px] sm:w-auto"
      />
      <StatTile
        icon={Wallet}
        label="Revenue"
        value={formatCurrency(summary.totalRevenue ?? 0)}
        className="w-[240px] sm:w-auto"
      />
    </section>
  );
}
