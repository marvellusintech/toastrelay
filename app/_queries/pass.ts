"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { getAllMyPassesApi, getMyPassApi, scanCheckInApi } from "@/lib/api/pass";
import { queryKeys } from "@/lib/api/query_keys";
import type { ScanQrPayload } from "@/types/payload";

export function useAllMyPasses() {
  return useQuery({
    queryKey: queryKeys.pass.all(),
    queryFn: () => getAllMyPassesApi(),
  });
}

export function useMyPass(eventId?: string) {
  return useQuery({
    queryKey: queryKeys.pass.byEvent(eventId ?? ""),
    queryFn: () => getMyPassApi(eventId ?? ""),
    enabled: Boolean(eventId),
  });
}

export function useScanCheckIn() {
  return useMutation({
    mutationFn: (payload: ScanQrPayload) => scanCheckInApi(payload),
  });
}
