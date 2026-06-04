import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { apiClient, ApiError } from "@/app/_queries/api_client";
import type { ApiResponse } from "@/lib/types";
import type { EventStage } from "@/lib/types/events";

export async function getEvents(signal?: AbortSignal): Promise<ApiResponse<EventStage[]>> {
  return apiClient<EventStage[]>("/events", {
    method: "GET",
    signal,
    withCredentials: true,
  });
}

export function useGetEvents() {
  return useQuery<ApiResponse<EventStage[]>, ApiError>({
    queryKey: ["events"],
    queryFn: ({ signal }) => getEvents(signal),
    placeholderData: keepPreviousData,
  });
}
