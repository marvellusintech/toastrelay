"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { getSavedBankAccountApi } from "@/lib/api/withdrawals";

export function usePayoutAccountGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const ensurePayoutAccount = async (requiresPayoutAccount: boolean) => {
    if (!requiresPayoutAccount) return true;

    try {
      const response = await getSavedBankAccountApi();
      if (response.data) return true;

      const queryString = searchParams.toString();
      const returnTo = queryString ? `${pathname}?${queryString}` : pathname;

      toast.info("Add a verified bank account before accepting payments.");
      router.push(
        `/dashboard/finance?tab=bank&returnTo=${encodeURIComponent(returnTo)}`,
      );
    } catch {
      toast.error("Unable to verify your payout account. Please try again.");
    }

    return false;
  };

  return { ensurePayoutAccount };
}
