"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { queryKeys } from "@/lib/api/query_keys";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const status = searchParams.get("status");

  useEffect(() => {
    // Invalidate wallet query so it refetches fresh data
    queryClient.invalidateQueries({ queryKey: queryKeys.wallet.mine() });
    queryClient.invalidateQueries({ queryKey: queryKeys.withdrawals.earnings() });

    // Redirect to finance page after a short delay
    const timer = setTimeout(() => {
      router.replace("/dashboard/finance");
    }, 2500);

    return () => clearTimeout(timer);
  }, [queryClient, router]);

  const isSuccess = status === "success" || !!reference;

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        {isSuccess ? (
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        ) : (
          <XCircle className="h-12 w-12 text-red-500" />
        )}
        <h1 className="text-xl font-bold text-foreground">
          {isSuccess ? "Payment Successful" : "Payment Status"}
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          {isSuccess
            ? "Your credits are being updated. Redirecting you shortly..."
            : "We could not confirm your payment. Redirecting you shortly..."}
        </p>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mt-2" />
      </div>
    </main>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
