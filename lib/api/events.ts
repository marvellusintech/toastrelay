import { apiClient } from "@/lib/api";
import { CreateEventPayload } from "@/types/payload";
import { EventDetails } from "@/types/response";

export type EventRes = {
  event: EventDetails;
  accessToken?: string;
};

export async function createEventApi(payload: CreateEventPayload) {
  const response = await apiClient.post<EventDetails>(`/events`, {
    data: payload,
    withCredentials: true,
  });
  return response;
}
