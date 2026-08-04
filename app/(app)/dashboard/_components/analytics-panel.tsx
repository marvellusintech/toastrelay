"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { getAnalyticsRevenueTrendApi } from "@/lib/api/user";
import { queryKeys } from "@/lib/api/query_keys";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { RevenueTrend } from "@/types/response";

function RevenueAnalyticsCard({
  revenueTrend,
  error,
  onRetry,
  isRefetching,
}: {
  revenueTrend: RevenueTrend[];
  error: string | null;
  onRetry: () => void;
  isRefetching: boolean;
}) {
  if (error && revenueTrend.length === 0) {
    return (
      <Card className="px-6 py-10 text-center text-sm text-muted-foreground">
        <p>{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={onRetry}
          disabled={isRefetching}
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </Card>
    );
  }

  if (!revenueTrend.length) {
    return (
      <Card className="px-6 py-10 text-center">
        <p className="text-sm font-semibold text-foreground">No activity yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Revenue trends will appear here once your events start selling.
        </p>
      </Card>
    );
  }

  const maxVal = Math.max(
    ...revenueTrend.map((d) => d.totalRevenue ?? 0),
    1,
  );

  return (
    <Card className="px-6 py-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-5 w-5 text-coral" />
        <h2 className="text-xl font-semibold">Event pulse</h2>
        {isRefetching && <Loader2 className="h-4 w-4 animate-spin text-muted" />}
      </div>

      {/* Breakdown */}
      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3">
        {[
          {
            label: "Ticket revenue",
            value: revenueTrend.reduce(
              (sum, d) => sum + (d.ticketRevenue ?? 0),
              0,
            ),
          },
          {
            label: "Contributions",
            value: revenueTrend.reduce(
              (sum, d) => sum + (d.contributionRevenue ?? 0),
              0,
            ),
          },
          {
            label: "Total",
            value: revenueTrend.reduce(
              (sum, d) => sum + (d.totalRevenue ?? 0),
              0,
            ),
          },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {item.label}
            </p>
            <p className="mt-1 text-2xl font-black font-display text-foreground">
              {formatCurrency(item.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <div className="mt-8">
        <p className="mb-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Revenue trend
        </p>
        <div className="flex h-48 items-end gap-2">
          {revenueTrend.map((d) => {
            const height =
              d.totalRevenue && maxVal > 0
                ? Math.max((d.totalRevenue / maxVal) * 100, 4)
                : 4;
            const label = d.date
              ? new Date(d.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              : "";

            return (
              <div
                key={d.date}
                className="flex h-full flex-1 flex-col justify-end gap-2"
              >
                <div
                  className="w-full rounded-t-md bg-turquoise transition-all"
                  style={{ height: `${height}%` }}
                />
                <p className="truncate text-center text-[10px] font-bold text-muted-foreground">
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export function AnalyticsPanel() {
  const { data, isLoading, isError, error, isRefetching, refetch } = useQuery({
    queryKey: queryKeys.analytics.revenueTrend(),
    queryFn: () => getAnalyticsRevenueTrendApi(),
    refetchOnWindowFocus: false,
  });

  const revenueTrend = data?.data ?? [];

  if (isLoading) {
    return (
      <Card className="flex h-64 items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading analytics...
      </Card>
    );
  }

  return (
    <RevenueAnalyticsCard
      revenueTrend={revenueTrend}
      error={isError ? (error instanceof Error ? error.message : "Failed to load analytics.") : null}
      onRetry={() => refetch()}
      isRefetching={isRefetching}
    />
  );
}
