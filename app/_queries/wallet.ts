"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getWalletApi, topUpWalletApi } from "@/lib/api/wallet";
import { queryKeys } from "@/lib/api/query_keys";
import type { TopUpWalletPayload } from "@/types/payload";

export function useWallet() {
  return useQuery({
    queryKey: queryKeys.wallet.mine(),
    queryFn: getWalletApi,
  });
}

export function useTopUpWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TopUpWalletPayload) => topUpWalletApi(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.wallet.mine(),
      });
    },
  });
}
