import { apiClient } from "@/lib/api";
import {
  CreateEventPayload,
  GetEventsOptions,
  GetUserEventsOptions,
  TicketTierPayload,
} from "@/types/payload";
import { EventDetails, EventTemplate, EventType } from "@/types/response";

export type EventRes = {
  event: EventDetails;
};

interface EventResponse {
  events: EventDetails[];
  pagination: {
    totalEvents: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasMore: boolean;
  };
}

export async function createEventApi(payload: CreateEventPayload) {
  const response = await apiClient.post<EventDetails>(`/events`, {
    data: payload,
    withCredentials: true,
  });
  return response;
}

export async function getEventsApi(params?: GetEventsOptions) {
  const response = await apiClient.get<EventResponse>(`/events`, {
    withCredentials: false,
    params,
  });
  return response;
}

export async function getUserEventsApi(params?: GetUserEventsOptions) {
  const response = await apiClient.get<EventResponse>(`/events/my-events`, {
    withCredentials: true,
    params,
  });
  return response;
}

export async function publishEventApi(eventId: string) {
  const response = await apiClient.patch<EventDetails>(
    `/events/${eventId}/publish`,
    {
      withCredentials: true,
    },
  );
  return response;
}

export async function deleteEventApi(eventId: string){

}

export async function updateEventApi(
  eventId: string,
  payload: Partial<CreateEventPayload>,
) {
  const response = await apiClient.put<EventDetails>(`/events/${eventId}`, {
    data: payload,
    withCredentials: true,
  });
  return response;
}

export async function getEventByIdApi(eventId: string) {
  const response = await apiClient.get<EventDetails>(
    `/events/single-event/${eventId}`,
    {
      withCredentials: true,
    },
  );
  return response;
}

export async function getEventBySlugApi(slug: string) {
  const response = await apiClient.get<EventDetails>(
    `/events/slug/${slug}`,
    {
      withCredentials: true,
    },
  );
  return response;
}

export async function upsertTicketApi({
  eventId,
  tiers,
}: {
  eventId: string;
  tiers: TicketTierPayload[];
}) {
  const response = await apiClient.put<EventDetails>(
    `/tickets/events/${eventId}`,
    { data: { tiers }, withCredentials: true },
  );
  return response;
}


export async function getEventCatgoriesApi() {
  const response = await apiClient.get<EventType>(
    `/events/metadata/types`,
    {
      withCredentials: true,
    },
  );
  return response;
}

export async function getEventTemplatesApi() {
  const response = await apiClient.get<EventTemplate>(
    `/events/metadata/templates`,
    {
      withCredentials: true,
    },
  );
  return response;
}