import { apiClient } from "@/lib/api";
import { ConsumeResourcePayload, TopUpWalletPayload } from "@/types/payload";
import { ConsumeResourceResult, TopUpWalletResult, Wallet } from "@/types/response";

export async function topUpWalletApi(payload: TopUpWalletPayload) {
  const response = await apiClient.post<TopUpWalletResult>(`/wallet/top-up`, {
    data: payload,
    withCredentials: true,
  });
  return response;
}

export async function getWalletApi() {
  const response = await apiClient.get<Wallet>(`/wallet`, {
    withCredentials: true,
  });
  return response;
}

export async function consumeResourceApi(payload: ConsumeResourcePayload) {
  const response = await apiClient.post<ConsumeResourceResult>(`/wallet/consume`, {
    data: payload,
    withCredentials: true,
  });
  return response;
}
