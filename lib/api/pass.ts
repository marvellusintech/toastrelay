import { apiClient } from "@/lib/api";
import { CheckInByCodePayload, ScanQrPayload } from "@/types/payload";
import {
  CheckInByCodeResult,
  EventPass,
  ScanCheckInResult,
  UserPass,
} from "@/types/response";

export async function getAllMyPassesApi() {
  const response = await apiClient.get<UserPass[]>(`/pass/my-passes`, {
    withCredentials: true,
  });
  return response;
}

export async function getMyPassApi(eventId: string) {
  const response = await apiClient.get<EventPass>(`/pass/event/${eventId}`, {
    withCredentials: true,
  });
  return response;
}

export async function scanCheckInApi(payload: ScanQrPayload) {
  const response = await apiClient.post<ScanCheckInResult>(`/pass/scan`, {
    data: payload,
    withCredentials: true,
  });
  return response;
}

export async function checkInByCodeApi(payload: CheckInByCodePayload) {
  const response = await apiClient.post<CheckInByCodeResult>(
    `/pass/checkin/by-code`,
    {
      data: payload,
      withCredentials: true,
    },
  );
  return response;
}
