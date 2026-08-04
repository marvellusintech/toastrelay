"use client";

import { useMutation } from "@tanstack/react-query";

import { sendEventEmailApi } from "@/lib/api/email";
import type { SendEventEmailPayload } from "@/types/payload";

export function useSendEventEmail() {
  return useMutation({
    mutationFn: (payload: SendEventEmailPayload) => sendEventEmailApi(payload),
  });
}
