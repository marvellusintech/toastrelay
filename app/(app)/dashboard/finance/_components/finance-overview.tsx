import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { TransactionHistoryItem } from "@/types/response";
import { TransactionRow } from "./transaction-row";
import { Info, ArrowDownToLine } from "lucide-react";

interface FinanceOverviewProps {
  pendingBalance: number;
  availableBalance: number;
  recentTransactions: TransactionHistoryItem[];
  onNavigateWithdraw?: () => void;
}

export function FinanceOverview({
  pendingBalance,
  availableBalance,
  recentTransactions,
}: FinanceOverviewProps) {
  return (
    <>
      {/* Manual Settlement Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-blue-900">
        <Info className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">Manual Settlement Schedule</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Funds from ticket sales, toasts, and contributions sit in your <strong>Pending wallet</strong> for 24 hours (T+1) before maturing into your <strong>Available wallet</strong>. From your Available wallet, you can manually request withdrawals directly to your saved bank account anytime.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="px-5 py-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Pending wallet
          </p>
          <p className="mt-1 text-2xl font-bold font-body text-foreground">
            {formatCurrency(pendingBalance)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Matures to Available balance in 24h (T+1)
          </p>
        </Card>

        <Card className="px-5 py-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Available wallet
          </p>
          <p className="mt-1 text-2xl font-bold font-body text-foreground">
            {formatCurrency(availableBalance)}
          </p>
          <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <ArrowDownToLine className="h-3.5 w-3.5" /> Ready for withdrawal
          </p>
        </Card>
      </div>

      {recentTransactions.length > 0 && (
        <Card className="px-6 py-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Recent Activity
          </h3>
          <div className="divide-y divide-line">
            {recentTransactions.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} />
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
