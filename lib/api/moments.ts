import { apiClient } from "@/lib/api";
import { MomentStatus } from "@/types/enum";
import {
  CreateMomentPayload,
  UpdateMomentStatusPayload,
} from "@/types/payload";
import { MomentRecord } from "@/types/response";

export async function uploadMomentApi(payload: CreateMomentPayload) {
  const response = await apiClient.post<MomentRecord>(`/moments`, {
    data: payload,
    withCredentials: true,
  });
  return response;
}

export async function getEventMomentsApi(
  eventId: string,
  params?: { status?: MomentStatus },
) {
  const response = await apiClient.get<MomentRecord[]>(
    `/moments/event/${eventId}`,
    {
      withCredentials: true,
      params,
    },
  );
  return response;
}

export async function updateMomentStatusApi(
  momentId: string,
  payload: UpdateMomentStatusPayload,
) {
  const response = await apiClient.patch<MomentRecord>(
    `/moments/${momentId}/status`,
    {
      data: payload,
      withCredentials: true,
    },
  );
  return response;
}

export async function deleteMomentApi(momentId: string) {
  const response = await apiClient.delete<null>(`/moments/${momentId}`, {
    withCredentials: true,
  });
  return response;
}
