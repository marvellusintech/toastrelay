"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  Building2,
  Coins,
  ChevronLeft,
  LayoutDashboard,
  ArrowDownToLine,
  History,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  getBanksApi,
  getEarningsApi,
  getTransactionHistoryApi,
} from "@/lib/api/withdrawals";
import { queryKeys } from "@/lib/api/query_keys";
import type { TransactionHistory } from "@/types/response";

import { FinanceOverview } from "./_components/finance-overview";
import { FinanceTopUp } from "./_components/finance-topup";
import { FinanceWithdraw } from "./_components/finance-withdraw";
import { FinanceBankAccount } from "./_components/finance-bank-account";
import { FinanceTransactionHistory } from "./_components/finance-transaction-history";
import { Button } from "@/components/ui/button";

type FinanceTab = "overview" | "topup" | "withdraw" | "bank" | "history";

const TAB_IDS: FinanceTab[] = [
  "overview",
  "topup",
  "withdraw",
  "bank",
  "history",
];

const financeTabs = [
  { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
  { id: "topup" as const, label: "Top Up", icon: Coins },
  { id: "bank" as const, label: "Bank Account", icon: Building2 },
  { id: "withdraw" as const, label: "Withdraw", icon: ArrowDownToLine },
  { id: "history" as const, label: "Transaction History", icon: History },
];

function isEventSetupReturnPath(value: string | null): value is string {
  return Boolean(
    value && /^\/dashboard\/events\/[^/?]+\/setup(?:\?.*)?$/.test(value),
  );
}

function FinanceContent() {
  const router = useRouter();

  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const initialTab = TAB_IDS.includes(searchParams.get("tab") as FinanceTab)
    ? (searchParams.get("tab") as FinanceTab)
    : "overview";
  const returnTo = searchParams.get("returnTo");
  const returnToAfterBankSetup = isEventSetupReturnPath(returnTo)
    ? returnTo
    : null;
  const [activeTab, setActiveTab] = useState<FinanceTab>(initialTab);

  const [bankAccountSuccess, setBankAccountSuccess] = useState(false);

  // --- Earnings ---
  const { data: earningsData, isLoading: earningsLoading } = useQuery({
    queryKey: queryKeys.withdrawals.earnings(),
    queryFn: () => getEarningsApi(),
  });
  const earnings = earningsData?.data;
  const pendingBalance = earnings ? Number(earnings.pending.balance) : 0;
  const availableBalance = earnings ? Number(earnings.available.balance) : 0;

  // --- Banks ---
  const { data: banksData } = useQuery({
    queryKey: queryKeys.withdrawals.banks(),
    queryFn: () => getBanksApi(),
  });
  void banksData;

  // --- Transaction History ---
  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: queryKeys.withdrawals.transactions(),
    queryFn: () => getTransactionHistoryApi(),
  });
  const txHistory: TransactionHistory = txData?.data ?? {
    pending: [],
    available: [],
    withdrawn: [],
  };
  const allTransactions = [
    ...txHistory.pending,
    ...txHistory.available,
    ...txHistory.withdrawn,
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (earningsLoading) {
    return (
      <main className="mx-auto flex min-h-[50vh] w-full max-w-5xl items-center justify-center px-6 py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted" />
      </main>
    );
  }

  return (
    <main className="bg-[#FAF9F6]">
      <div className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-8 lg:px-10">
        <Button
          onClick={() => router.push("/dashboard")}
          size="sm"
          variant="ghost"
          className="px-0 mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="mb-8 lg:mb-16">
          <h1 className="mt-2 text-4xl font-black font-display md:text-2xl">
            Finance
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your earnings, credits, and withdrawals.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Vertical Tabs Sidebar */}
          <nav className="w-full md:w-56 shrink-0">
            <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
              {financeTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "bg-foreground text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Tab Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {activeTab === "overview" && (
              <FinanceOverview
                pendingBalance={pendingBalance}
                availableBalance={availableBalance}
                recentTransactions={allTransactions.slice(0, 5)}
              />
            )}

            {activeTab === "topup" && <FinanceTopUp />}

            {activeTab === "withdraw" && (
              <FinanceWithdraw availableBalance={availableBalance} />
            )}

            {activeTab === "bank" && (
              <FinanceBankAccount
                bankAccountSuccess={bankAccountSuccess}
                onSaved={() => {
                  queryClient.invalidateQueries({
                    queryKey: queryKeys.withdrawals.earnings(),
                  });
                  setBankAccountSuccess(true);
                  if (returnToAfterBankSetup) {
                    router.push(returnToAfterBankSetup);
                  }
                }}
              />
            )}

            {activeTab === "history" && (
              <FinanceTransactionHistory
                transactions={allTransactions}
                isLoading={txLoading}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function FinancePage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-[50vh] w-full max-w-5xl items-center justify-center px-6 py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </main>
      }
    >
      <FinanceContent />
    </Suspense>
  );
}
