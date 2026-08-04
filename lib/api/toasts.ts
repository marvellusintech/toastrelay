import { apiClient } from "@/lib/api";
import { ToastRecord } from "@/types/response";

export async function getEventToastsApi(eventId: string) {
  const response = await apiClient.get<ToastRecord[]>(`/toasts/event/${eventId}`, {
    withCredentials: false,
  });
  return response;
}

export async function deleteToastApi(toastId: string) {
  const response = await apiClient.delete<null>(`/toasts/${toastId}`, {
    withCredentials: true,
  });
  return response;
}
