import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { TransactionHistoryItem } from "@/types/response";
import { TransactionRow } from "./transaction-row";

interface FinanceTransactionHistoryProps {
  transactions: TransactionHistoryItem[];
  isLoading: boolean;
}

export function FinanceTransactionHistory({ transactions, isLoading }: FinanceTransactionHistoryProps) {
  return (
<Card className="px-6 py-6 h-[500px] flex flex-col">
  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 shrink-0">
    All Transactions
  </h3>
  {isLoading ? (
    <div className="flex justify-center items-center flex-1">
      <Loader2 className="h-6 w-6 animate-spin text-muted" />
    </div>
  ) : transactions.length === 0 ? (
    <p className="text-sm text-muted-foreground py-12 text-center flex-1">
      No transactions yet.
    </p>
  ) : (
    <div className="divide-y divide-line overflow-y-auto flex-1 pr-2">
      {transactions.map((tx) => (
        <TransactionRow key={tx.id} transaction={tx} />
      ))}
    </div>
  )}
</Card>
  );
}
