import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient, ApiError } from "@/lib/api";
import { queryKeys } from "@/app/_queries/query_keys";
import type { ApiResponse } from "@/lib/types";
import type { EventStage } from "@/types/events";
import type { EventDetails } from "@/types/response";
import type { EventInput } from "@/lib/validation/events/event_schema";

export type ListEventsParams = {
  page?: number;
  limit?: number;
  search?: string;
  type?: EventStage["type"];
  is_public?: boolean;
};

export type UpsertEventPayload = EventInput & {
  image_url?: string;
  template_id?: string;
};

export type SubmitToastPayload = {
  userId?: string;
  username: string;
  userPhoto?: string;
  message: string;
  mediaUrl?: string;
  type?: "text" | "image" | "gift";
  amount?: number;
};

export function getEvents(params?: ListEventsParams, signal?: AbortSignal) {
  return apiClient<EventStage[], never, ListEventsParams>("/events", {
    method: "GET",
    params,
    signal,
    withCredentials: true,
  });
}

export function getPublicEvents(params?: ListEventsParams, signal?: AbortSignal) {
  return apiClient<EventStage[], never, ListEventsParams>("/events/public", {
    method: "GET",
    params,
    signal,
    suppressGlobalError: true,
  });
}

export function getEvent(eventId: string, signal?: AbortSignal) {
  return apiClient<EventDetails>(`/events/${eventId}`, {
    method: "GET",
    signal,
    withCredentials: true,
  });
}

export function createEvent(payload: UpsertEventPayload) {
  return apiClient<EventStage, UpsertEventPayload>("/events", {
    method: "POST",
    data: payload,
    withCredentials: true,
  });
}

export function updateEvent(eventId: string, payload: Partial<UpsertEventPayload>) {
  return apiClient<EventStage, Partial<UpsertEventPayload>>(`/events/${eventId}`, {
    method: "PATCH",
    data: payload,
    withCredentials: true,
  });
}

export function deleteEvent(eventId: string) {
  return apiClient<null>(`/events/${eventId}`, {
    method: "DELETE",
    withCredentials: true,
  });
}

export function submitToast(eventId: string, payload: SubmitToastPayload) {
  return apiClient<unknown, SubmitToastPayload>(`/events/${eventId}/toasts`, {
    method: "POST",
    data: payload,
    suppressGlobalError: true,
  });
}

export function useGetEvents(params?: ListEventsParams) {
  return useQuery<ApiResponse<EventStage[]>, ApiError>({
    queryKey: queryKeys.events.list(params),
    queryFn: ({ signal }) => getEvents(params, signal),
    placeholderData: keepPreviousData,
  });
}

export function usePublicEvents(params?: ListEventsParams) {
  return useQuery<ApiResponse<EventStage[]>, ApiError>({
    queryKey: queryKeys.events.list({ ...params, scope: "public" }),
    queryFn: ({ signal }) => getPublicEvents(params, signal),
    placeholderData: keepPreviousData,
  });
}

export function useEvent(eventId: string) {
  return useQuery<ApiResponse<EventDetails>, ApiError>({
    queryKey: queryKeys.events.detail(eventId),
    queryFn: ({ signal }) => getEvent(eventId, signal),
    enabled: Boolean(eventId),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<EventStage>, ApiError, UpsertEventPayload>({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.lists() });
    },
  });
}

export function useUpdateEvent(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<EventStage>, ApiError, Partial<UpsertEventPayload>>({
    mutationFn: (payload) => updateEvent(eventId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.lists() });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, ApiError, string>({
    mutationFn: deleteEvent,
    onSuccess: (_, eventId) => {
      queryClient.removeQueries({ queryKey: queryKeys.events.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.lists() });
    },
  });
}

export function useSubmitToast() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<unknown>,
    ApiError,
    { eventId: string; payload: SubmitToastPayload }
  >({
    mutationFn: ({ eventId, payload }) => submitToast(eventId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(variables.eventId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.toasts(variables.eventId) });
    },
  });
}
