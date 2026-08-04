"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query_keys";
import { getUserApi } from "@/lib/api/user";
import { removeAuthToken } from "@/lib/auth-cookies";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => getUserApi(),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      removeAuthToken();
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch {
        // Server-side cookie clearing is best-effort; the client cookie is
        // already removed above.
      }
      queryClient.clear();
    },
  });
}
