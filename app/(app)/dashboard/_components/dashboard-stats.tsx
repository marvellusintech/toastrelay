"use client";

import { useQuery } from "@tanstack/react-query";
import {
  CalendarCheck,
  Loader2,
  Ticket,
  Banknote,
  Wallet,
  Info,
} from "lucide-react";
import Link from "next/link";

import { getAnalyticsSummaryApi } from "@/lib/api/user";
import { queryKeys } from "@/lib/api/query_keys";
import { StatTile } from "@/components/reuseables/stat_tile";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/utils";
import { getEarningsApi, getSettlementStatusApi } from "@/lib/api/withdrawals";

export function DashboardStats() {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.analytics.summary(),
    queryFn: () => getAnalyticsSummaryApi(),
  });

  const { data: earningsData, isLoading: earningsLoading } = useQuery({
    queryKey: queryKeys.withdrawals.earnings(),
    queryFn: () => getEarningsApi(),
  });

  const { data: settlementStatusData, isLoading: settlementStatusLoading } =
    useQuery({
      queryKey: ["withdrawals", "status"],
      queryFn: () => getSettlementStatusApi(),
    });

  const summary = data?.data;
  const earnings = earningsData?.data;
  const settlementStatus = settlementStatusData?.data;
  const pendingBalance = settlementStatus
    ? Number(settlementStatus.earningsTracking.pendingBalance ?? settlementStatus.earningsTracking.pendingAmount ?? earnings?.pending?.balance ?? 0)
    : Number(earnings?.pending?.balance ?? 0);
  const availableBalance = settlementStatus
    ? Number(settlementStatus.earningsTracking.availableBalance ?? settlementStatus.earningsTracking.maturedAmount ?? earnings?.available?.balance ?? 0)
    : Number(earnings?.available?.balance ?? 0);

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

  return (
    <section className={containerClass}>
      {/* Wallet Balance Tile */}
      <Link
        href="/dashboard/finance?tab=withdrawals"
        className="w-[240px] shrink-0 sm:shrink sm:w-auto group"
      >
        <Card className="h-full gap-0 px-4 pt-4 pb-4 bg-neutral-900 border-neutral-800 transition group-hover:shadow-sm group-hover:border-neutral-700 flex flex-col">
          <div className="flex flex-col items-start gap-2">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-white/10">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <p className="text-sm font-medium text-neutral-400">Earnings</p>
            <div>
              <p className="text-3xl font-body font-bold tracking-normal text-white">
                {settlementStatusLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  formatCurrency(availableBalance)
                )}
              </p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="mt-1 inline-flex items-center gap-1 cursor-help">
                      <Info className="h-3 w-3 text-neutral-500" />
                      <span className="text-[11px] text-neutral-500">
                        {settlementStatusLoading
                          ? "—"
                          : formatCurrency(pendingBalance)}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="bg-neutral-800 text-white text-xs max-w-[220px]"
                  >
                    <p>
                      Settling funds · Funds settle to your bank within 24h
                      after payment
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="mt-auto flex justify-end">
            <p className="text-xs text-neutral-400 font-semibold group-hover:text-[var(--primary)] transition-colors">
             Withdrawal
            </p>
          </div>
        </Card>
      </Link>

      <StatTile
        icon={Banknote}
        label="Revenue"
        value={summary ? formatCurrency(summary.totalRevenue ?? 0) : "—"}
        className="w-[240px] sm:w-auto"
      />
      <StatTile
        icon={CalendarCheck}
        label="Total Events"
        value={summary ? String(summary.totalEvents ?? 0) : "—"}
        tone="turquoise"
        className="w-[240px] sm:w-auto"
      />
      <StatTile
        icon={Ticket}
        label="Tickets Sold"
        value={summary ? String(summary.ticketsSold ?? 0) : "—"}
        tone="gold"
        className="w-[240px] sm:w-auto"
      />
    </section>
  );
}
