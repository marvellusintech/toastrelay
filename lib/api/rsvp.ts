import { apiClient } from "@/lib/api";
import { RSVPStatus } from "@/types/enum";
import { Guest } from "@/types/response";

export async function getEventRsvpsApi(
  eventId: string,
  params?: { status?: RSVPStatus },
) {
  const response = await apiClient.get<Guest[]>(`/rsvp/event/${eventId}`, {
    withCredentials: true,
    params,
  });
  return response;
}

export async function getMyRsvpApi(eventId: string) {
  const response = await apiClient.get<Guest | null>(
    `/rsvp/event/${eventId}/my-rsvp`,
    {
      withCredentials: true,
    },
  );
  return response;
}
