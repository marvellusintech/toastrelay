"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { verifyEmailApi } from "@/lib/api/auth";



export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const code = searchParams.get("code");
  
  const effectRan = useRef(false);

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: verifyEmailApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Email verified successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    },
  });

  useEffect(() => {
    if (effectRan.current) return;

    if (token && code) {
      mutate({ token, code });
    }
    
    return () => {
      effectRan.current = true;
    };
  }, [token, code, mutate]);

  // Missing parameters fallback
  if (!token || !code) {
    return (
      <div className="py-20 px-4 max-w-xl mx-auto my-20">
        <Card className="p-8 text-center space-y-4">
          <XCircle className="w-12 h-12 text-destructive mx-auto" />
          <h3 className="text-2xl font-bold text-black">Invalid Verification Link</h3>
          <p className="text-sm text-black/60">
            This verification link is incomplete or broken. Please make sure you copied the entire URL from your email.
          </p>
          <Button className="mt-4" onClick={() => router.push("/login")}>
            Go to Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-20 px-4 lg:px-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto my-20"
      >
        <Card className="p-8 md:p-12 text-center">
          {isPending && (
            <div className="space-y-4 py-6">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
              <h3 className="text-2xl font-bold text-black">Verifying your email</h3>
              <p className="text-sm text-black/50 font-body">
                Please hold on a moment while we validate your credentials...
              </p>
            </div>
          )}

          {isSuccess && (
            <div className="space-y-4 py-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-2xl font-bold text-black">Account Verified!</h3>
              <p className="text-sm text-black/50 font-body">
                Thank you for confirming your email. You are being redirected to your dashboard...
              </p>
              <Button className="mt-4" onClick={() => router.push("/dashboard")}>
                Go to Dashboard Now
              </Button>
            </div>
          )}

          {isError && (
            <div className="space-y-4 py-6">
              <XCircle className="w-12 h-12 text-destructive mx-auto" />
              <h3 className="text-2xl font-bold text-black">Verification Failed</h3>
              <p className="text-sm text-black/50 font-body">
                {error instanceof Error ? error.message : "The verification link might have expired or already been used."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button variant="outline" onClick={() => router.push("/create-account")}>
                  Back to Registration
                </Button>
                <Button onClick={() => router.push("/login")}>
                  Try Signing In
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}