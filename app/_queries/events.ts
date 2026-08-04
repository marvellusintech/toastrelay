"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createToastApi, getEventByIdApi } from "@/lib/api/events";
import { queryKeys } from "@/lib/api/query_keys";
import type { CreateToastPayload } from "@/types/payload";

export type SubmitToastPayload = CreateToastPayload;

export function useEvent(eventId?: string) {
  return useQuery({
    queryKey: queryKeys.events.detail(eventId ?? ""),
    queryFn: () => getEventByIdApi(eventId ?? ""),
    enabled: Boolean(eventId),
  });
}

export function useSubmitToast(eventId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createToastApi,
    onSuccess: () => {
      if (eventId) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.events.toasts(eventId),
        });
      }
    },
  });
}
