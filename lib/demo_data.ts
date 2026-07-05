import type {
  EventStage,
  Guest,
  Moment,
  ThreadItem,
  TicketTier,
  ToastMessage,
} from "@/types/events";

export const demoEvents: EventStage[] = [
  {
    id: "demo-event-1",
    name: "Summer Garden Gala",
    description:
      "An evening of celebration under the stars with toasts, music, photos, and guest passes.",
    owner_id: "demo-user",
    owner_name: "Demo Host",
    date: "2026-07-15",
    time: "18:00",
    location: "The Glass House, London",
    type: "social",
    template_id: "social-dynamic",
    is_public: true,
    image_url:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=80",
    created_at: "2026-05-20T12:00:00.000Z",
    thread_config: { enabled: true, access: "open" },
  },
  {
    id: "demo-event-2",
    name: "Sarah & James Wedding",
    description:
      "A warm wedding stage for RSVPs, shared memories, contribution toasts, and guest check-in.",
    owner_id: "demo-user",
    owner_name: "Demo Host",
    date: "2026-09-20",
    time: "14:00",
    location: "St. Mary's Cathedral",
    type: "wedding",
    template_id: "wedding-classic",
    is_public: true,
    image_url:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
    created_at: "2026-05-19T12:00:00.000Z",
    thread_config: { enabled: true, access: "circle-only" },
  },
];

export const demoGuests: Guest[] = [
  {
    id: "guest-1",
    event_id: "demo-event-1",
    name: "Alice Johnson",
    email: "alice@example.com",
    category: "friend",
    rsvp_status: "attending",
  },
  {
    id: "guest-2",
    event_id: "demo-event-1",
    name: "Bob Smith",
    email: "bob@example.com",
    category: "friend",
    rsvp_status: "pending",
  },
  {
    id: "guest-3",
    event_id: "demo-event-1",
    name: "Charlie Davis",
    email: "charlie@example.com",
    category: "family",
    rsvp_status: "maybe",
  },
];

export const demoToasts: ToastMessage[] = [
  {
    id: "toast-1",
    event_id: "demo-event-1",
    author_name: "Alice Johnson",
    content: "So happy to be here. The garden looks amazing.",
    contribution_type: "energy",
    created_at: "2026-05-20T10:00:00.000Z",
  },
  {
    id: "toast-2",
    event_id: "demo-event-1",
    author_name: "Charlie Brown",
    content: "Cheers to a wonderful evening.",
    contribution_type: "gift",
    amount: 100,
    created_at: "2026-05-20T11:00:00.000Z",
  },
];

export const demoMoments: Moment[] = [
  {
    id: "moment-1",
    event_id: "demo-event-1",
    uploader_name: "Alice Johnson",
    image_url:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=900&q=80",
    caption: "The room before everyone arrived.",
    status: "approved",
    reaction_count: 5,
  },
  {
    id: "moment-2",
    event_id: "demo-event-1",
    uploader_name: "Bob Smith",
    image_url:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80",
    caption: "First toast of the night.",
    status: "approved",
    reaction_count: 3,
  },
];

export const demoTicketTiers: TicketTier[] = [
  {
    id: "tier-1",
    name: "General Admission",
    price: 0,
    capacity: 100,
    sold: 45,
    description: "Standard entry to the celebration.",
  },
  {
    id: "tier-2",
    name: "VIP Garden Access",
    price: 50,
    capacity: 20,
    sold: 12,
    description: "Private garden access and premium drinks.",
  },
];

export const demoThreadItems: ThreadItem[] = [
  {
    id: "thread-1",
    event_id: "demo-event-1",
    name: "Silk Fabric",
    description: "Premium silk for coordinated guest attire.",
    price: 50,
    image_url:
      "https://images.unsplash.com/photo-1534639077088-d702bcf685e1?auto=format&fit=crop&w=900&q=80",
    category: "Fabric",
    status: "available",
  },
  {
    id: "thread-2",
    event_id: "demo-event-1",
    name: "Evening Style",
    description: "A complete look for the celebration.",
    price: 120,
    image_url:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
    category: "Style",
    status: "available",
  },
];
