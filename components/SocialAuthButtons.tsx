"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { generatePKCE } from "@/lib/pkce";

interface SocialAuthButtonsProps {
  mode: "login" | "signup";
  disabled?: boolean;
}

const GOOGLE_CLIENT_ID = "881744326884-uiegsm2ljmq146fhu4ves7n2kd7qdop3.apps.googleusercontent.com";
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export function SocialAuthButtons({ mode, disabled }: SocialAuthButtonsProps) {
  const handleGoogleRedirect = async () => {
    try {
        // const googleRedirectUri = `${window.location.origin}/callback/google`;
        const googleRedirectUri = `http://localhost:3000/callback/google`

      // 1. Generate security state and PKCE verifier/challenge
      const state = crypto.randomUUID();
       const challenge = await generatePKCE();

      // 2. Save state and verifier locally so we can verify them on the callback route
      sessionStorage.setItem("oauth_state", state);

      // 3. Build OAuth query parameters
      const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: googleRedirectUri,
        response_type: "code",
        scope: "openid email profile",
        code_challenge: challenge,
        code_challenge_method: "S256",
        access_type: "offline",
        prompt: "consent",
        state,
      });

      // 4. Redirect full window to Google
      window.location.href = `${GOOGLE_AUTH_URL}?${params.toString()}`;
    } catch (error) {
      console.error("Failed to initialize PKCE redirect:", error);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-black/5"></div>
        <span className="flex-shrink mx-4 text-black/50 text-[9px] font-mono uppercase tracking-[0.2em]">
          OR
        </span>
        <div className="flex-grow border-t border-black/5"></div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Button
          variant="secondary"
          className="w-full"
          type="button"
          onClick={handleGoogleRedirect}
          disabled={disabled}
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.15-.43-.19-.9-.19-1.39c0-.25.04-.49.1-.73z"
              fillRule="evenodd"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          {mode === "login" ? "Sign In with Google" : "Sign Up with Google"}
        </Button>
      </div>
    </div>
  );
}