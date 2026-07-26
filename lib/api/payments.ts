import { apiClient } from "@/lib/api";
import { InitializePaymentPayload } from "@/types/payload";

export async function initializePaymentApi(payload: InitializePaymentPayload) {
  const response = await apiClient.post<string>(`/payments/initialize`, {
    data: payload,
    withCredentials: false,
  });
  return response;
}