import { apiClient } from "@/lib/api";
import { TicketStatus } from "@/types/enum";
import { LookupGuestTicketPayload } from "@/types/payload";
import { LookupGuestTicketResult } from "@/types/response";

export type CheckInTicketResponse = {
  id: string;
  status: TicketStatus;
  checkedInAt: string | null;
};

export async function checkInTicketApi(ticketId: string) {
  const response = await apiClient.post<CheckInTicketResponse>(
    `/tickets/${ticketId}/check-in`,
    {
      withCredentials: true,
    },
  );
  return response;
}

export async function lookupGuestTicketApi(payload: LookupGuestTicketPayload) {
  const response = await apiClient.post<LookupGuestTicketResult>(`/tickets/lookup`, {
    data: payload,
    withCredentials: false,
  });
  return response;
}
