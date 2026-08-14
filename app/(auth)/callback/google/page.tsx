"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { socialAuthApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { SocialProvider } from "@/types/enum";
import { saveAuthToken } from "@/lib/auth-cookies";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  // Track handshake state per component instance instead of global variable
  const isHandshakeTriggered = useRef(false);

  const socialAuthMutation = useMutation({
    mutationFn: socialAuthApi,
  });

  useEffect(() => {
    if (isHandshakeTriggered.current) return;

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      toast.error(`Authentication failed: ${error}`);
      router.push("/login");
      return;
    }

    if (!code || !state) {
      toast.error("Invalid callback URL configuration.");
      router.push("/login");
      return;
    }

    const savedState = sessionStorage.getItem("oauth_state");
    const codeVerifier = sessionStorage.getItem("pkce_verifier");

    if (state !== savedState || !codeVerifier) {
      toast.error("Security validation failed. Cross-site request detected.");
      router.push("/login");
      return;
    }

    isHandshakeTriggered.current = true;

    sessionStorage.removeItem("oauth_state");
    sessionStorage.removeItem("pkce_verifier");

    const finalizeLogin = async () => {
      try {
        const apiResponse = await socialAuthMutation.mutateAsync({
          token: code,
          codeVerifier: codeVerifier,
          provider: SocialProvider.GOOGLE,
        });

        if (apiResponse.data?.user) {
          saveAuthToken(apiResponse.data.token, apiResponse.data.tokenExpiresOn);
          setAuth(apiResponse.data.user);
        }

        toast.success("Logged in successfully via Google!");
        router.push("/dashboard");
      } catch (err) {
        isHandshakeTriggered.current = false;
        toast.error("Server authentication failed.");
        router.push("/login");
      }
    };

    finalizeLogin();
  }, [searchParams, router, socialAuthMutation, setAuth]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="text-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent mx-auto"></div>
        <p className="text-sm font-medium text-black/70 font-mono tracking-wide">
          Completing secure handshake...
        </p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-white">
          <div className="text-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent mx-auto"></div>
            <p className="text-sm font-medium text-black/70 font-mono tracking-wide">
              Loading authentication...
            </p>
          </div>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}