"use client";

import { Loader2, ArrowDownToLine, Wallet as WalletIcon, AlertTriangle, Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { queryKeys } from "@/lib/api/query_keys";
import {
  getSavedBankAccountApi,
  requestWithdrawalApi,
} from "@/lib/api/withdrawals";

const withdrawalSchema = z.object({
  amount: z
    .number({ message: "Amount is required" })
    .min(2000, "Minimum withdrawal is ₦2,000"),
});

type WithdrawalValues = z.infer<typeof withdrawalSchema>;

interface FinanceWithdrawProps {
  availableBalance: number;
}

export function FinanceWithdraw({ availableBalance }: FinanceWithdrawProps) {
  const queryClient = useQueryClient();
  const { data: savedBankAccountData, isLoading: isSavedBankAccountLoading } =
    useQuery({
      queryKey: queryKeys.withdrawals.savedBankAccount(),
      queryFn: getSavedBankAccountApi,
    });
  const savedBankAccount = savedBankAccountData?.data;

  const withdrawalForm = useForm<WithdrawalValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: { amount: 2000 },
  });

  const withdrawalMutation = useMutation({
    mutationFn: requestWithdrawalApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.withdrawals.earnings() });
      queryClient.invalidateQueries({ queryKey: queryKeys.withdrawals.transactions() });
      toast.success("Withdrawal initiated! Processing...");
      withdrawalForm.reset();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to initiate withdrawal");
    },
  });

  function onWithdrawSubmit(values: WithdrawalValues) {
    if (!savedBankAccount) {
      toast.error("Save a bank account before requesting a withdrawal");
      return;
    }

    withdrawalMutation.mutate({ amount: values.amount });
  }

  return (
    <>
      <Card className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Available for withdrawal
            </p>
            <p className="mt-1 text-2xl font-bold font-body text-foreground">
              {formatCurrency(availableBalance)}
            </p>
          </div>
          <WalletIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      </Card>

      <Card className="px-6 py-6">
        <h2 className="text-base font-bold text-foreground mb-1">Withdraw Earnings</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Transfer your earnings to your saved bank account. Minimum ₦2,000.
        </p>

        <div className="mb-6 border-y border-border py-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Building2 className="h-4 w-4" />
            Withdrawal account
          </div>

          {isSavedBankAccountLoading ? (
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading saved account...
            </div>
          ) : savedBankAccount ? (
            <div className="mt-3 space-y-1 text-sm">
              <p className="font-semibold text-foreground">
                {savedBankAccount.bankName}
              </p>
              <p className="text-muted-foreground">
                {savedBankAccount.accountName} · {savedBankAccount.accountNumber}
              </p>
            </div>
          ) : (
            <div className="mt-3 flex items-start gap-2 text-sm text-amber-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>Save a bank account in the Bank Account tab before withdrawing.</p>
            </div>
          )}
        </div>

        <form onSubmit={withdrawalForm.handleSubmit(onWithdrawSubmit)} className="space-y-4">
          <Field>
            <FieldLabel>Amount (₦)</FieldLabel>
            <Input
              type="number"
              min={2000}
              inputMode="numeric"
              {...withdrawalForm.register("amount", { valueAsNumber: true })}
              placeholder="e.g. 5000"
            />
            {withdrawalForm.formState.errors.amount && (
              <FieldError errors={[withdrawalForm.formState.errors.amount]} />
            )}
          </Field>

          <Button
            type="submit"
            disabled={
              withdrawalMutation.isPending ||
              isSavedBankAccountLoading ||
              !savedBankAccount ||
              availableBalance < 2000
            }
            className="w-full gap-1.5"
          >
            {withdrawalMutation.isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
            ) : (
              <><ArrowDownToLine className="h-4 w-4" /> Withdraw</>
            )}
          </Button>
        </form>

        {availableBalance < 2000 && (
          <div className="mt-4 flex items-start gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>You need at least ₦2,000 to withdraw.</span>
          </div>
        )}
      </Card>
    </>
  );
}
