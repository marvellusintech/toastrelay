"use client";

import { Loader2, ArrowDownToLine, Wallet as WalletIcon, AlertTriangle, Building2, CheckCircle2 } from "lucide-react";
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
    .min(100, "Minimum withdrawal is ₦100"),
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
    defaultValues: {
      amount: 100,
    },
  });

  const withdrawalMutation = useMutation({
    mutationFn: requestWithdrawalApi,
    onSuccess: (res) => {
      toast.success(res.message || "Withdrawal request submitted successfully");
      withdrawalForm.reset({ amount: 100 });
      queryClient.invalidateQueries({ queryKey: queryKeys.withdrawals.earnings() });
      queryClient.invalidateQueries({ queryKey: queryKeys.withdrawals.transactions() });
      queryClient.invalidateQueries({ queryKey: queryKeys.withdrawals.settlementStatus() });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to submit withdrawal request");
    },
  });

  function onWithdrawSubmit(values: WithdrawalValues) {
    if (!savedBankAccount) {
      toast.error("Save a bank account before requesting a withdrawal");
      return;
    }

    if (values.amount > availableBalance) {
      withdrawalForm.setError("amount", {
        type: "manual",
        message: `Amount exceeds available balance (${formatCurrency(availableBalance)})`,
      });
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
              Available Wallet
            </p>
            <p className="mt-1 text-2xl font-bold font-body text-foreground">
              {formatCurrency(availableBalance)}
            </p>
          </div>
          <WalletIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      </Card>

      <Card className="px-6 py-6">
        <h2 className="text-base font-bold text-foreground mb-1">Request Manual Withdrawal</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Request a transfer from your Available balance to your saved bank account. Minimum withdrawal is ₦100.
        </p>

        <div className="mb-6 border-y border-border py-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Building2 className="h-4 w-4" />
            Payout Account Destination
          </div>

          {isSavedBankAccountLoading ? (
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              Loading payout account details...
            </div>
          ) : savedBankAccount ? (
            <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Account Verified & Configured for Manual Payouts</span>
              </div>
              <p className="mt-2 text-sm font-bold text-zinc-900">{savedBankAccount.accountName}</p>
              <p className="text-xs text-zinc-600">
                {savedBankAccount.bankName} •••••{savedBankAccount.accountNumber.slice(-4)}
              </p>
            </div>
          ) : (
            <div className="mt-3 flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold">No Bank Account Added</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Please add your bank details before requesting a withdrawal.
                </p>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={withdrawalForm.handleSubmit(onWithdrawSubmit)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="amount">Withdrawal Amount (₦)</FieldLabel>
            <Input
              id="amount"
              type="number"
              min={100}
              placeholder="e.g. 5000"
              {...withdrawalForm.register("amount", { valueAsNumber: true })}
            />
            {withdrawalForm.formState.errors.amount && (
              <FieldError>{withdrawalForm.formState.errors.amount.message}</FieldError>
            )}
          </Field>

          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={
              withdrawalMutation.isPending ||
              !savedBankAccount ||
              availableBalance < 100
            }
          >
            {withdrawalMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Request...
              </>
            ) : (
              <>
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Submit Withdrawal Request
              </>
            )}
          </Button>
        </form>
      </Card>
    </>
  );
}
