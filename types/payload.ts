import {
  EventStatus,
  PaymentIntentType,
  PaymentProvider,
  RSVPStatus,
  SocialProvider,
} from "./enum";

export interface ThemeConfig {
  // palette?: string;
  primaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  borderRadius?: "none" | "sm" | "md" | "lg" | "full";
  // updatedAt?: string;
}

export type SocialAuthPayload = {
  token: string;
  provider: SocialProvider;
  codeVerifier?: string;
};

export type RegisterPayload = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type VerifyEmailPayload = {
  code: string;
  token: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ChangePasswordDto = {
  currentPassword: string;
  newPassword: string;
};

// events

export type CreateEventPayload = {
  name: string;
  isExternal: boolean;
};
export type UpdateEventPayload = CreateEventPayload & Partial<{
  name: string;
  slug: string;
  description: string;
  startDate: Date;
  endDate: string;
  location: string;
  coverImage: string;
  extraMedia: string[];
  eventTypeId: string;
  templateId: string;
  theme?: string;
  isCustomTheme: boolean;
  isPublic: boolean;
  isExternal: boolean;
  externalUrl: string;
}>;

export type GetEventsOptions = Partial<{
  page: number;
  limit: number;
  search: string;
  eventTypeId: string;
  status: EventStatus;
  isPublic: boolean;
}>;

export type GetUserEventsOptions = GetEventsOptions & {
  role?: "host" | "guest" | "all";
};

export type TicketTierPayload = {
  id?: string; // Present when updating an existing tier; undefined when creating a new one
  name: string; // e.g., "General Admission", "VIP"
  price: number; // 0 for free tickets, otherwise positive amount
  capacity: number; // Total tickets available for this tier
};

// // Full Request Body Payload
// export type UpsertTicketingPayload = {
//   tiers: TicketTierPayload[];
// }

export type SubmitRsvpPayload = {
  eventId: string;
  rsvpStatus: RSVPStatus;
  name?: string;
  email?: string;
  phone?: string;
};

export type InitializePaymentPayload = {
  amount: number;
  currency: string;
  provider: PaymentProvider;
  intentType: PaymentIntentType;
  intentId?: string;

  email?: string;
  eventId?: string;
  toastContent?: string;
  authorName?: string;

  metadata?: Record<string, unknown>;
};

export type CreateToastPayload = {
  eventId: string;
  content: string;
  authorName?: string;
  amount?: number;
  email?: string;
  currency?: string;
  callbackUrl?: string;
};
