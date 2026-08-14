export const queryKeys = {
  auth: {
    root: ["auth"] as const,
    me: () => [...queryKeys.auth.root, "me"] as const,
  },
  circles: {
    root: ["circles"] as const,
    lists: () => [...queryKeys.circles.root, "list"] as const,
    myCircles: () => [...queryKeys.circles.lists(), "my-circles"] as const,
  },
  moments: {
    root: ["moments"] as const,
    byEvent: (eventId: string) => [...queryKeys.moments.root, eventId] as const,
  },
  threads: {
    root: ["threads"] as const,
    byEvent: (eventId: string) => [...queryKeys.threads.root, eventId] as const,
  },
  rsvp: {
    root: ["rsvp"] as const,
    byEvent: (eventId: string) => [...queryKeys.rsvp.root, eventId] as const,
    myRsvp: (eventId: string) => [...queryKeys.rsvp.byEvent(eventId), "my-rsvp"] as const,
  },
  interactions: {
    root: ["interactions"] as const,
  },
  analytics: {
    root: ["analytics"] as const,
    summary: () => [...queryKeys.analytics.root, "summary"] as const,
    revenueTrend: () => [...queryKeys.analytics.root, "revenue-trend"] as const,
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
  wallet: {
    root: ["wallet"] as const,
    mine: () => [...queryKeys.wallet.root, "mine"] as const,
  },
  withdrawals: {
    root: ["withdrawals"] as const,
    earnings: () => [...queryKeys.withdrawals.root, "earnings"] as const,
    banks: () => [...queryKeys.withdrawals.root, "banks"] as const,
    savedBankAccount: () =>
      [...queryKeys.withdrawals.root, "bank-account"] as const,
    history: () => [...queryKeys.withdrawals.root, "history"] as const,
    transactions: () => [...queryKeys.withdrawals.root, "transactions"] as const,
  },
  pass: {
    root: ["pass"] as const,
    all: () => [...queryKeys.pass.root, "all"] as const,
    byEvent: (eventId: string) => [...queryKeys.pass.root, eventId] as const,
  },
};
