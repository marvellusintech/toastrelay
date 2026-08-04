import { apiClient } from "@/lib/api";
import { InitializePaymentPayload, PurchaseStoragePayload } from "@/types/payload";
import { InitializePaymentResult, PurchaseStorageResult } from "@/types/response";

export async function initializePaymentApi(payload: InitializePaymentPayload) {
  const response = await apiClient.post<InitializePaymentResult>(`/payments/initialize`, {
    data: payload,
    withCredentials: false,
  });
  return response;
}

export async function purchaseStorageApi(payload: PurchaseStoragePayload) {
  const response = await apiClient.post<PurchaseStorageResult>(`/payments/storage`, {
    data: payload,
    withCredentials: true,
  });
  return response;
}
