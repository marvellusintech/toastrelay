"use client";

import { QrCode, CircleDollarSign, Loader2 } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query_keys";
import { useWallet } from "@/app/_queries/wallet";
import { formatCurrency } from "@/lib/utils";

export function QuickAccess() {
  const { data: walletData, isLoading: walletLoading } = useWallet();
  const wallet = walletData?.data;
  const creditsBalance = wallet ? Number(wallet.balance) : 0;

  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2">
      {/* My passes */}
      <Link
        href="/dashboard/passes"
        className="group flex items-start gap-4 rounded-2xl border border-line bg-panel p-5 transition hover:border-turquoise hover:shadow-sm"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
          <QrCode className="h-5 w-5 text-foreground" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-foreground group-hover:text-turquoise">
            My passes
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            View your QR passes and tickets
          </p>
        </div>
      </Link>

      {/* Credits */}
      <Link
        href="/dashboard/finance"
        className="group flex items-start gap-4 rounded-2xl border border-line bg-panel p-5 transition hover:border-turquoise hover:shadow-sm"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
          <CircleDollarSign className="h-5 w-5 text-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground group-hover:text-turquoise">
              Credits
            </h3>
            <span className="text-xs text-muted-foreground font-semibold group-hover:text-turquoise transition-colors">
              Top up?
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {walletLoading ? (
              <span className="inline-flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" /> Loading...
              </span>
            ) : (
              <span className="font-semibold text-foreground">
                {formatCurrency(creditsBalance)}
              </span>
            )}{" "}
            available credits
          </p>
        </div>
      </Link>
    </section>
  );
}
