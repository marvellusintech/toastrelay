import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { TransactionHistoryItem } from "@/types/response";
import { TransactionRow } from "./transaction-row";

interface FinanceOverviewProps {
  pendingBalance: number;
  availableBalance: number;
  recentTransactions: TransactionHistoryItem[];
}

export function FinanceOverview({
  pendingBalance,
  availableBalance,
  recentTransactions,
}: FinanceOverviewProps) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="px-5 py-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Pending wallet
          </p>
          <p className="mt-1 text-2xl font-bold font-body text-foreground">
            {formatCurrency(pendingBalance)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Funds settle within 24h after payment
          </p>
        </Card>

        <Card className="px-5 py-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Available wallet
          </p>
          <p className="mt-1 text-2xl font-bold font-body text-foreground">
            {formatCurrency(availableBalance)}
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
