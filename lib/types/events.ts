import type { EVENT_TYPES } from "@/lib/constants";

export type EventType = (typeof EVENT_TYPES)[number];
export type RsvpStatus = "pending" | "attending" | "declined" | "maybe";
export type GuestCategory = "family" | "friend" | "vip" | "other";
export type MomentStatus = "pending" | "approved" | "rejected";
export type ContributionType = "gift" | "contribution" | "support" | "energy";
export type ThreadAccess = "open" | "circle-only";

export interface EventStage {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  owner_name: string;
  date: string;
  time?: string;
  location?: string;
  contact_info?: string;
  rsvp_deadline?: string;
  type: EventType;
  template_id: string;
  is_public: boolean;
  image_url?: string;
  created_at: string;
  thread_config?: {
    enabled: boolean;
    access: ThreadAccess;
  };
  custom_theme?: {
    primary_color?: string;
    secondary_color?: string;
    font_family?: "sans" | "serif" | "display" | "mono";
  };
}

export interface Guest {
  id: string;
  event_id: string;
  name: string;
  email?: string;
  category: GuestCategory;
  rsvp_status: RsvpStatus;
  is_circle_member?: boolean;
}

export interface ToastMessage {
  id: string;
  event_id: string;
  author_name: string;
  content: string;
  image_url?: string;
  amount?: number;
  contribution_type?: ContributionType;
  created_at: string;
}

export interface Moment {
  id: string;
  event_id: string;
  uploader_name: string;
  image_url: string;
  caption?: string;
  status: MomentStatus;
  reaction_count: number;
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  capacity: number;
  sold: number;
  description?: string;
}

export interface ThreadItem {
  id: string;
  event_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  status: "available" | "sold-out" | "discontinued";
}
