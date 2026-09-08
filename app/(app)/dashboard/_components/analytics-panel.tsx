"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, Loader2, RefreshCw } from "lucide-react";

import { getAnalyticsRevenueTrendApi } from "@/lib/api/user";
import { queryKeys } from "@/lib/api/query_keys";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { RevenueTrend } from "@/types/response";

const chartConfig = {
  totalRevenue: {
    label: "Total revenue",
    theme: {
      light: "var(--turquoise-500)",
      dark: "var(--turquoise-400)",
    },
  },
} satisfies ChartConfig;

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
      <Card className="px-6 py-10 mb-10 text-center">
        <p className="text-sm font-semibold text-foreground">No activity yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Revenue trends will appear here once your events start selling.
        </p>
      </Card>
    );
  }

  return (
    <Card className="px-6 py-6 mb-20">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-5 w-5 text-coral" />
        <h2 className="text-xl font-semibold">Event pulse</h2>
        {isRefetching && (
          <Loader2 className="h-4 w-4 animate-spin text-muted" />
        )}
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
          {
            label: "Service fees",
            value: revenueTrend.reduce(
              (sum, d) => sum + (d.serviceFees ?? 0),
              0,
            ),
          },
          {
            label: "Net revenue",
            value: revenueTrend.reduce(
              (sum, d) => sum + (d.netRevenue ?? 0),
              0,
            ),
          },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {item.label}
            </p>
            <p className="mt-1 text-2xl font-bold font-body text-foreground">
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
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[240px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={revenueTrend}
            margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={20}
              tickFormatter={(value) => {
                if (!value) return "";
                const date = new Date(value);
                return isNaN(date.getTime())
                  ? String(value)
                  : date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={48}
              tickFormatter={(value) => {
                if (value >= 1_000_000)
                  return `₦${(value / 1_000_000).toFixed(1)}M`;
                if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}k`;
                return `₦${value}`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    if (!value) return "";
                    const date = new Date(value);
                    return isNaN(date.getTime())
                      ? String(value)
                      : date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                  }}
                  formatter={(value, name, item) => {
                    const row = item.payload as RevenueTrend | undefined;
                    return (
                      <div className="grid min-w-[160px] gap-1.5">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                              style={{
                                backgroundColor: "var(--color-totalRevenue)",
                              }}
                            />
                            <span className="text-muted-foreground">
                              Total revenue
                            </span>
                          </div>
                          <span className="font-mono font-bold text-foreground tabular-nums">
                            {formatCurrency(Number(value))}
                          </span>
                        </div>
                        {row &&
                          ((row.ticketRevenue ?? 0) > 0 ||
                            (row.contributionRevenue ?? 0) > 0) && (
                            <div className="grid gap-1 border-t border-border/50 pt-1 text-[11px]">
                              {(row.ticketRevenue ?? 0) > 0 && (
                                <div className="flex items-center justify-between text-muted-foreground">
                                  <span>Tickets</span>
                                  <span className="font-mono tabular-nums">
                                    {formatCurrency(row.ticketRevenue)}
                                  </span>
                                </div>
                              )}
                              {(row.contributionRevenue ?? 0) > 0 && (
                                <div className="flex items-center justify-between text-muted-foreground">
                                  <span>Contributions</span>
                                  <span className="font-mono tabular-nums">
                                    {formatCurrency(row.contributionRevenue)}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    );
                  }}
                />
              }
            />
            <Bar
              dataKey="totalRevenue"
              fill="var(--color-totalRevenue)"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
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
      error={
        isError
          ? error instanceof Error
            ? error.message
            : "Failed to load analytics."
          : null
      }
      onRetry={() => refetch()}
      isRefetching={isRefetching}
    />
  );
}
