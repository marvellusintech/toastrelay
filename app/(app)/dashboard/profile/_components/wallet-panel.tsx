"use client";

import { Loader2, Plus, RefreshCw, Wallet as WalletIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTopUpWallet, useWallet } from "@/app/_queries/wallet";
import { formatCurrency } from "@/lib/utils";

export function WalletPanel() {
  const { data, isLoading, isError, refetch, isRefetching } = useWallet();
  const topUpMutation = useTopUpWallet();
  const [amount, setAmount] = useState("");

  const wallet = data?.data;

  async function handleTopUp() {
    const value = Number(amount);
    if (!value || value < 100) {
      toast.error("Minimum top-up is ₦100");
      return;
    }
    try {
      const res = await topUpMutation.mutateAsync({ amount: value });
      const url = res.data?.authorizationUrl;
      if (url) window.location.href = url;
      else toast.success("Top-up initiated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to top up wallet",
      );
    }
  }

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center px-6 py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </Card>
    );
  }

  if (isError || !wallet) {
    return (
      <Card className="px-6 py-16 text-center text-sm text-muted-foreground">
        <p>Unable to load your wallet.</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Wallet balance
            </p>
            <p className="mt-1 text-3xl font-black font-display text-foreground">
              {formatCurrency(Number(wallet.balance))}
            </p>
          </div>
          <WalletIcon className="h-8 w-8 text-turquoise" />
        </div>

        <div className="mt-6">
          <FieldGroup className="gap-2">
            <Field>
              <FieldLabel htmlFor="topup-amount">Top up (₦, min ₦100)</FieldLabel>
              <div className="flex gap-2">
                <Input
                  id="topup-amount"
                  type="number"
                  min={100}
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 2000"
                  disabled={topUpMutation.isPending}
                />
                <Button
                  onClick={handleTopUp}
                  disabled={topUpMutation.isPending}
                >
                  {topUpMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Top up
                </Button>
              </div>
            </Field>
          </FieldGroup>
          <p className="mt-2 text-xs text-muted-foreground">
            ₦1 = 1 credit. Credits are used for email &amp; SMS broadcasts.
          </p>
        </div>
      </Card>

      <Card className="px-6 py-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Transaction history
        </h2>
        {!wallet.entries?.length ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No transactions yet.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-line">
            {wallet.entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground capitalize">
                    {entry.type.toLowerCase()}
                    {entry.resourceType
                      ? ` · ${entry.resourceType.toLowerCase()}`
                      : ""}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {entry.description ?? entry.reference ?? "Wallet activity"}
                  </p>
                </div>
                <span
                  className={
                    entry.type === "CREDIT"
                      ? "text-sm font-bold text-emerald-600"
                      : "text-sm font-bold text-foreground"
                  }
                >
                  {entry.type === "CREDIT" ? "+" : "−"}
                  {formatCurrency(Number(entry.amount))}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
