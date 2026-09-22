"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { socialAuthApi, type AuthSession } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { SocialProvider } from "@/types/enum";
import { saveAuthToken, hasAuthToken } from "@/lib/auth-cookies";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Module-level map to track in-flight handshake promises by OAuth code.
// This prevents duplicate execution in React 18/19 Strict Mode or concurrent renders
// where single-use OAuth authorization codes would otherwise be burned twice.
const handshakePromiseCache = new Map<
  string,
  Promise<{ token: string; user?: unknown; tokenExpiresOn?: Date | string }>
>();

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTakingLonger, setIsTakingLonger] = useState(false);

  // Prevent multiple calls within the same component mount
  const isHandshakeTriggered = useRef(false);

  // Fallback timer if the network or redirect takes longer than usual
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTakingLonger(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isHandshakeTriggered.current) return;

    // If the user already has an active auth session (e.g. from hot reload or prior completed handshake),
    // immediately navigate to dashboard rather than re-evaluating or failing PKCE validation.
    if (hasAuthToken()) {
      if (typeof window !== "undefined") {
        window.location.replace("/dashboard");
      } else {
        router.replace("/dashboard");
      }
      return;
    }

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      const msg = `Authentication failed: ${error}`;
      setStatus("error");
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    if (!code || !state) {
      const msg = "Invalid callback URL configuration. Required parameters are missing.";
      setStatus("error");
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    const savedState = sessionStorage.getItem("oauth_state");
    const codeVerifier = sessionStorage.getItem("pkce_verifier");

    // Check if an existing in-flight handshake promise already exists for this code
    const existingHandshake = handshakePromiseCache.get(code);

    if (!existingHandshake && (state !== savedState || !codeVerifier)) {
      const msg = "Security validation failed. Cross-site request detected.";
      setStatus("error");
      setErrorMessage(msg);
      toast.error(msg);
      return;
    }

    isHandshakeTriggered.current = true;

    const runHandshake = async () => {
      try {
        let handshakePromise = handshakePromiseCache.get(code);

        if (!handshakePromise) {
          handshakePromise = (async () => {
            const apiResponse = await socialAuthApi({
              token: code,
              codeVerifier: codeVerifier ?? undefined,
              provider: SocialProvider.GOOGLE,
            });

            // Handle both { data: { token, user } } and direct { token, user } formats
            const sessionData =
              (apiResponse as { data?: AuthSession }).data ??
              (apiResponse as unknown as AuthSession);

            const token = sessionData?.token;
            const user = sessionData?.user;
            const tokenExpiresOn = sessionData?.tokenExpiresOn;

            if (!token) {
              throw new Error(
                apiResponse.message || "Failed to retrieve authentication token."
              );
            }

            // Save the auth token in cookies (handles HTTP/HTTPS, Lax SameSite, safe expiration)
            saveAuthToken(token, tokenExpiresOn);

            if (user) {
              setAuth(user);
            }

            // Only remove stored PKCE values upon successful completion
            sessionStorage.removeItem("oauth_state");
            sessionStorage.removeItem("pkce_verifier");

            return { token, user, tokenExpiresOn };
          })();

          handshakePromiseCache.set(code, handshakePromise);
        }

        await handshakePromise;

        setStatus("success");
        toast.success("Logged in successfully via Google!");

        // Top-level hard navigation ensures the auth cookie is sent in HTTP request
        // headers to middleware/proxy, cleans Next.js App Router cache, and removes
        // the callback URL from browser history.
        if (typeof window !== "undefined") {
          window.location.replace("/dashboard");
        } else {
          router.replace("/dashboard");
        }
      } catch (err) {
        handshakePromiseCache.delete(code);
        isHandshakeTriggered.current = false;
        const msg = err instanceof Error ? err.message : "Server authentication failed.";
        setStatus("error");
        setErrorMessage(msg);
        toast.error(msg);
      }
    };

    runHandshake();
  }, [searchParams, router, setAuth]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF9F6] px-4 py-12">
      <Card className="w-full max-w-md p-8 text-center space-y-6 shadow-sm border border-neutral-200/80 bg-white">
        {status === "loading" && (
          <div className="space-y-4 py-4">
            <div className="relative mx-auto flex h-14 w-14 items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-neutral-900" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold font-body text-neutral-900 tracking-tight">
                Completing secure handshake...
              </h2>
              <p className="text-sm font-medium text-neutral-500 font-sans">
                Verifying your credentials and setting up your session.
              </p>
            </div>

            {isTakingLonger && (
              <div className="pt-4 border-t border-neutral-100 space-y-3">
                <p className="text-xs text-neutral-400">
                  Taking longer than expected?
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.location.replace("/dashboard");
                      } else {
                        router.replace("/dashboard");
                      }
                    }}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/login")}
                  >
                    Return to Login
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold font-body text-neutral-900 tracking-tight">
                Authentication Successful
              </h2>
              <p className="text-sm font-medium text-neutral-500 font-sans">
                Redirecting you to your dashboard...
              </p>
            </div>
            <Button
              variant="default"
              className="w-full mt-2"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.replace("/dashboard");
                } else {
                  router.replace("/dashboard");
                }
              }}
            >
              Go to Dashboard Now
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4 py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold font-body text-neutral-900 tracking-tight">
                Authentication Failed
              </h2>
              <p className="text-sm text-neutral-600 font-sans">
                {errorMessage || "We were unable to complete your authentication request."}
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => router.push("/login")}
              >
                Return to Login
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-[#FAF9F6] px-4 py-12">
          <Card className="w-full max-w-md p-8 text-center space-y-4 shadow-sm border border-neutral-200/80 bg-white">
            <div className="relative mx-auto flex h-14 w-14 items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-neutral-900" />
            </div>
            <p className="text-sm font-medium text-neutral-500 font-sans">
              Loading authentication...
            </p>
          </Card>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}