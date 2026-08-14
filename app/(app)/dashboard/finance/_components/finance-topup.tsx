"use client";

import { useState } from "react";
import { Loader2, Plus, Coins } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTopUpWallet } from "@/app/_queries/wallet";

export function FinanceTopUp() {
  const topUpMutation = useTopUpWallet();
  const [topUpAmount, setTopUpAmount] = useState("");

  async function handleTopUp() {
    const value = Number(topUpAmount);
    if (!value || value < 100) {
      toast.error("Minimum top-up is ₦100");
      return;
    }
    try {
      const callbackUrl = typeof window !== "undefined"
        ? `${window.location.origin}/payments/callback`
        : undefined;
      const res = await topUpMutation.mutateAsync({ amount: value, callbackUrl });
      const url = res.data?.authorizationUrl;
      if (url) window.location.href = url;
      else toast.success("Top-up initiated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to top up wallet");
    }
  }

  return (
    <Card className="px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gold/10">
          <Coins className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">Top Up Credits</h2>
          <p className="text-xs text-muted-foreground">₦1 = 1 credit. Used for broadcasts & resources.</p>
        </div>
      </div>

      <FieldGroup className="gap-4">
        <Field>
          <FieldLabel htmlFor="topup-amount">Amount (₦)</FieldLabel>
          <div className="flex gap-2">
            <Input
              id="topup-amount"
              type="number"
              min={100}
              inputMode="numeric"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              placeholder="e.g. 2000"
              disabled={topUpMutation.isPending}
            />
            <Button variant={'secondary'} onClick={handleTopUp} disabled={topUpMutation.isPending} className="gap-1.5">
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

      {/* <p className="mt-4 text-xs text-muted-foreground">
        Credits are used for email &amp; SMS broadcasts to your circle members.
      </p> */}
    </Card>
  );
}
