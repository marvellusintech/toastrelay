import { formatCurrency } from "@/lib/utils";
import type { TransactionHistoryItem } from "@/types/response";

interface TransactionRowProps {
  transaction: TransactionHistoryItem;
}

export function TransactionRow({ transaction: tx }: TransactionRowProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground capitalize">
          {tx.category === "withdrawal" ? "withdrawal" : tx.type?.toLowerCase()}
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
  );
}
