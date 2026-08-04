import { apiClient } from "@/lib/api";
import {
  CreateThreadPayload,
  ThreadItemPayload,
  UpsertThreadPayload,
} from "@/types/payload";
import { ThreadDetail, ThreadItem } from "@/types/response";

export async function createThreadApi(payload: CreateThreadPayload) {
  const response = await apiClient.post<ThreadDetail>(`/threads`, {
    data: payload,
    withCredentials: true,
  });
  return response;
}

export async function getEventThreadApi(eventId: string) {
  const response = await apiClient.get<ThreadDetail>(
    `/threads/event/${eventId}`,
    {
      withCredentials: true,
    },
  );
  return response;
}

export async function addThreadItemApi(
  threadId: string,
  payload: ThreadItemPayload,
) {
  const response = await apiClient.post<ThreadItem>(
    `/threads/${threadId}/items`,
    {
      data: payload,
      withCredentials: true,
    },
  );
  return response;
}

export async function upsertEventThreadApi(
  eventId: string,
  payload: UpsertThreadPayload,
) {
  const response = await apiClient.put<ThreadDetail>(
    `/threads/event/${eventId}`,
    {
      data: payload,
      withCredentials: true,
    },
  );
  return response;
}
