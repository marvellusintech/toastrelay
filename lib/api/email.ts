import { apiClient } from "@/lib/api";
import { SendEventEmailPayload } from "@/types/payload";
import { SendEventEmailResult } from "@/types/response";

export async function sendEventEmailApi(payload: SendEventEmailPayload) {
  const response = await apiClient.post<SendEventEmailResult>(`/email/send`, {
    data: payload,
    withCredentials: true,
  });
  return response;
}
