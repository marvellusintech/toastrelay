"use client";

import { useEffect } from "react";

import { useCurrentUser, useLogout } from "@/app/_queries/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";

export function useAuthSession() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isStoreLoading = useAuthStore((state) => state.isLoading);
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoading = useAuthStore((state) => state.setLoading);
  const clearAuth = useAuthStore((state) => state.logout);
  const currentUserQuery = useCurrentUser();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (currentUserQuery.isPending) {
      setLoading(true);
      return;
    }

    if (currentUserQuery.data?.data) {
      setAuth(currentUserQuery.data.data);
      return;
    }

    if (currentUserQuery.isError) {
      clearAuth();
      return;
    }

    setLoading(false);
  }, [
    clearAuth,
    currentUserQuery.data,
    currentUserQuery.isError,
    currentUserQuery.isPending,
    setAuth,
    setLoading,
  ]);

  async function signOut() {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      clearAuth();
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading: isStoreLoading || currentUserQuery.isPending,
    isLoggingOut: logoutMutation.isPending,
    sessionError: currentUserQuery.error,
    refetchSession: currentUserQuery.refetch,
    signOut,
  };
}
