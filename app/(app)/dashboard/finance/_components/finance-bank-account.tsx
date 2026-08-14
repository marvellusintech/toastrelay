"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Loader2,
  Building2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { queryKeys } from "@/lib/api/query_keys";
import {
  getBanksApi,
  getSavedBankAccountApi,
  saveBankAccountApi,
  resolveAccountApi,
} from "@/lib/api/withdrawals";
import type { BankInfo } from "@/types/response";

const bankAccountSchema = z.object({
  accountNumber: z
    .string()
    .min(10, "Account number must be 10 digits")
    .max(10, "Account number must be 10 digits")
    .regex(/^\d+$/, "Account number must be digits only"),
  bankCode: z.string().min(1, "Please select a bank"),
  bankName: z.string().min(1, "Please select a bank"),
  accountName: z.string().min(1, "Account name is required"),
});

type BankAccountValues = z.infer<typeof bankAccountSchema>;

interface FinanceBankAccountProps {
  bankAccountSuccess: boolean;
  onSaved: () => void;
}

export function FinanceBankAccount({ bankAccountSuccess, onSaved }: FinanceBankAccountProps) {
  const queryClient = useQueryClient();

  const [bankSearch, setBankSearch] = useState("");
  const [showBankDropdown, setShowBankDropdown] = useState(false);

  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const resolveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastResolvedRef = useRef<string | null>(null);

  const { data: banksData } = useQuery({
    queryKey: queryKeys.withdrawals.banks(),
    queryFn: () => getBanksApi(),
  });
  const banks: BankInfo[] = banksData?.data ?? [];

  const { data: savedBankAccountData } = useQuery({
    queryKey: queryKeys.withdrawals.savedBankAccount(),
    queryFn: getSavedBankAccountApi,
  });
  const savedBankAccount = savedBankAccountData?.data;

  const bankForm = useForm<BankAccountValues>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: { accountNumber: "", bankCode: "", bankName: "", accountName: "" },
    values: savedBankAccount ?? undefined,
    resetOptions: { keepDirtyValues: true },
  });

  const bankCodeVal = bankForm.watch("bankCode");
  const accountNumberVal = bankForm.watch("accountNumber");
  const accountNameVal = bankForm.watch("accountName");
  const isSavedAccount =
    savedBankAccount?.accountNumber === accountNumberVal &&
    savedBankAccount.bankCode === bankCodeVal &&
    savedBankAccount.accountName === accountNameVal;
  const isVerifiedAccount = Boolean(resolvedName) || isSavedAccount;

  const doResolve = useCallback(
    async (accNum: string, bCode: string) => {
      if (accNum.length !== 10 || !bCode) return;
      const cacheKey = accNum + bCode;
      if (lastResolvedRef.current === cacheKey) return;
      setResolving(true);
      setResolvedName(null);
      try {
        const res = await resolveAccountApi({ accountNumber: accNum, bankCode: bCode });
        const name = res.data?.accountName;
        if (name) {
          setResolvedName(name);
          bankForm.setValue("accountName", name, { shouldValidate: true });
          lastResolvedRef.current = cacheKey;
        } else {
          setResolvedName(null);
          bankForm.setValue("accountName", "");
        }
      } catch {
        setResolvedName(null);
        bankForm.setValue("accountName", "");
      } finally {
        setResolving(false);
      }
    },
    [bankForm],
  );

  const handleBankAccountNumberChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    bankForm.setValue("accountNumber", digits, { shouldValidate: true });
    if (resolveTimerRef.current) clearTimeout(resolveTimerRef.current);
    lastResolvedRef.current = null;
    if (digits.length === 10 && bankCodeVal) {
      resolveTimerRef.current = setTimeout(() => doResolve(digits, bankCodeVal), 400);
    } else {
      setResolvedName(null);
      bankForm.setValue("accountName", "");
    }
  };

  const handleBankSelect = (bank: BankInfo) => {
    bankForm.setValue("bankCode", bank.code);
    bankForm.setValue("bankName", bank.name);
    setBankSearch(bank.name);
    setShowBankDropdown(false);
    const currentAccNum = bankForm.getValues("accountNumber");
    lastResolvedRef.current = null;
    if (currentAccNum.length === 10) {
      setResolving(true);
      setResolvedName(null);
      doResolve(currentAccNum, bank.code);
    }
  };

  const saveBankMutation = useMutation({
    mutationFn: saveBankAccountApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.withdrawals.earnings() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.withdrawals.savedBankAccount(),
      });
      toast.success("Bank account saved successfully");
      onSaved();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save bank account");
    },
  });

  const filteredBanks = useMemo(() => {
    if (!bankSearch.trim()) return banks.slice(0, 15);
    const q = bankSearch.toLowerCase();
    return banks.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 15);
  }, [banks, bankSearch]);

  function onBankSubmit(values: BankAccountValues) {
    saveBankMutation.mutate(values);
  }

  return (
    <Card className="px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Bank Account
        </h2>
        {(bankAccountSuccess || isVerifiedAccount) && (
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Verified
          </span>
        )}
      </div>

      <form onSubmit={bankForm.handleSubmit(onBankSubmit)} className="space-y-4">
        <Field>
          <FieldLabel>Bank</FieldLabel>
          <div className="relative">
            <Input
              placeholder="Search for your bank..."
              value={bankSearch || bankForm.watch("bankName")}
              onChange={(e) => {
                setBankSearch(e.target.value);
                setShowBankDropdown(true);
                bankForm.setValue("bankCode", "");
                bankForm.setValue("bankName", "");
              }}
              onFocus={() => setShowBankDropdown(true)}
              onBlur={() => setTimeout(() => setShowBankDropdown(false), 200)}
            />
            {showBankDropdown && (
              <div className="absolute z-50 top-full mt-1 w-full max-h-48 overflow-y-auto bg-white border border-zinc-200 rounded-xl shadow-lg">
                {filteredBanks.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-muted-foreground">No banks found</div>
                ) : (
                  filteredBanks.map((bank) => (
                    <button
                      key={bank.code}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleBankSelect(bank)}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 transition-colors"
                    >
                      {bank.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          {bankForm.formState.errors.bankCode && (
            <FieldError errors={[bankForm.formState.errors.bankCode]} />
          )}
        </Field>

        <Field>
          <FieldLabel>Account Number</FieldLabel>
          <Input
            placeholder="e.g. 0123456789"
            value={bankForm.watch("accountNumber")}
            onChange={(e) => handleBankAccountNumberChange(e.target.value)}
            maxLength={10}
            inputMode="numeric"
          />
          {bankForm.formState.errors.accountNumber && (
            <FieldError errors={[bankForm.formState.errors.accountNumber]} />
          )}
        </Field>

        <Field>
          <FieldLabel>Account Name</FieldLabel>
          <div className="relative">
            <Input
              value={resolving ? "Resolving account name..." : (bankForm.watch("accountName") || "")}
              disabled
              readOnly
              placeholder={
                !bankCodeVal
                  ? "Select a bank first"
                  : accountNumberVal.length < 10
                    ? "Enter 10-digit account number"
                    : resolving
                      ? "Resolving..."
                      : "Account name will appear here"
              }
              className={isVerifiedAccount ? "text-foreground font-medium" : "text-muted-foreground"}
            />
            {isVerifiedAccount && !resolving && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
            )}
            {resolving && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          {bankForm.formState.errors.accountName && (
            <FieldError errors={[bankForm.formState.errors.accountName]} />
          )}
          <p className="flex items-center gap-1 mt-1.5 text-[11px] text-muted-foreground">
            <AlertTriangle className="h-3 w-3" />
            {isSavedAccount
              ? "Saved bank account."
              : resolvedName
                ? "Verified via bank resolution."
                : "Enter your account number to auto-resolve the account name."}
          </p>
        </Field>

        <Button variant={'secondary'} type="submit" disabled={saveBankMutation.isPending || resolving || !isVerifiedAccount} className="w-full">
          {saveBankMutation.isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</>
          ) : (
            "Save Bank Account"
          )}
        </Button>
      </form>
    </Card>
  );
}
