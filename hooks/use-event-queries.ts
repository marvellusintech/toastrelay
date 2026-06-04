import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.toastrelay.dev';


export interface SubmitToastPayload {
  userId: string;
  username: string;
  userPhoto?: string;
  message: string;
  mediaUrl?: string;
  type?: 'text' | 'image' | 'gift';
}

export function useEvent(eventId: string) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/events/${eventId}`);
      if (!res.ok) throw new Error('Network error pulling event data');
      return res.json();
    },
  });
}

export function useSubmitToast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ eventId, payload }: { eventId: string; payload: SubmitToastPayload }) => {
      const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/toasts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
    },
  });
}