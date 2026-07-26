// components/providers/auth-event-listener.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useAuthStore } from "@/lib/store/useAuthStore";

export function AuthEventListener({ children }: { children: React.ReactNode }) {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  useEffect(() => {
    function handleUnauthorized() {
      // 1. Clear Zustand state and delete cookies via your existing logout()
      logout();

      // 2. Redirect the user back to the login page
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [logout, router]);

  return <>{children}</>;
}