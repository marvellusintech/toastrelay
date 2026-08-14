"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { queryKeys } from "@/lib/api/query_keys";
import { getTransactionHistoryApi } from "@/lib/api/withdrawals";
import { formatCurrency } from "@/lib/utils";
import type { TransactionHistory } from "@/types/response";

export default function TransactionsPage() {
  const router = useRouter();

  const { data: txData, isLoading } = useQuery({
    queryKey: queryKeys.withdrawals.transactions(),
    queryFn: () => getTransactionHistoryApi(),
  });

  const txHistory: TransactionHistory = txData?.data ?? { pending: [], available: [], withdrawn: [] };
  const allTransactions = [...txHistory.pending, ...txHistory.available, ...txHistory.withdrawn].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="bg-[#FAF9F6]">
      <div className="mx-auto w-full max-w-4xl px-6 py-8 sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-black font-display md:text-2xl">Transaction History</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            All earnings and withdrawals.
          </p>
        </div>

        <Card className="px-6 py-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted" />
            </div>
          ) : allTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">No transactions yet.</p>
          ) : (
            <div className="divide-y divide-line">
              {allTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground capitalize">
                      {tx.category === "withdrawal" ? "withdrawal" : tx.type?.toLowerCase()}
                      {tx.status && (
                        <span className={`ml-2 text-xs font-medium ${
                          tx.status === "PENDING" ? "text-amber-600" :
                          tx.status === "AVAILABLE" ? "text-emerald-600" :
                          "text-muted-foreground"
                        }`}>
                          {tx.status}
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {tx.description ?? "Activity"}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      tx.category === "earnings" ? "text-emerald-600" : "text-foreground"
                    }`}
                  >
                    {tx.category === "earnings" ? "+" : "−"}
                    {formatCurrency(Math.abs(Number(tx.amount)))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
