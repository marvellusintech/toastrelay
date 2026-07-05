export const queryKeys = {
  auth: {
    root: ["auth"] as const,
    me: () => [...queryKeys.auth.root, "me"] as const,
  },
  events: {
    root: ["events"] as const,
    lists: () => [...queryKeys.events.root, "list"] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.events.lists(), params ?? {}] as const,
    details: () => [...queryKeys.events.root, "detail"] as const,
    detail: (eventId: string) => [...queryKeys.events.details(), eventId] as const,
    guests: (eventId: string) => [...queryKeys.events.detail(eventId), "guests"] as const,
    moments: (eventId: string) => [...queryKeys.events.detail(eventId), "moments"] as const,
    thread: (eventId: string) => [...queryKeys.events.detail(eventId), "thread"] as const,
    toasts: (eventId: string) => [...queryKeys.events.detail(eventId), "toasts"] as const,
  },
};
