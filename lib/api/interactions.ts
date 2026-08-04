import { apiClient } from "@/lib/api";
import {
  CheckInPayload,
  InteractionMomentPayload,
  InteractionToastPayload,
} from "@/types/payload";
import { EventAttendance, MomentRecord, ToastRecord } from "@/types/response";

export async function createInteractionToastApi(
  payload: InteractionToastPayload,
) {
  const response = await apiClient.post<ToastRecord>(`/interactions/toast`, {
    data: payload,
    withCredentials: true,
  });
  return response;
}

export async function createInteractionMomentApi(
  payload: InteractionMomentPayload,
) {
  const response = await apiClient.post<MomentRecord>(`/interactions/moment`, {
    data: payload,
    withCredentials: true,
  });
  return response;
}

export async function checkInApi(payload: CheckInPayload) {
  const response = await apiClient.post<EventAttendance>(`/interactions/check-in`, {
    data: payload,
    withCredentials: true,
  });
  return response;
}
