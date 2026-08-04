import {
  EventStatus,
  MomentStatus,
  PaymentIntentType,
  PaymentProvider,
  ResourceType,
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
  currency: "NGN" | "USD";
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
  format: "PHYSICAL" | "ONLINE" | "HYBRID";
  onlineUrl: string;
  allowRsvp: boolean;
  allowMoments: boolean;
  allowToasts: boolean;
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

// ---------- AUTH ----------

export type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
};

export type SetPasswordPayload = {
  password: string;
};

export type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

// ---------- CIRCLES ----------

export type CreateCirclePayload = {
  name: string;
  description?: string;
};

export type AddCircleMembersPayload = {
  userIds: string[];
};

export type LinkEventCirclePayload = {
  eventId: string;
  circleId: string;
  canViewPrivateDetails?: boolean;
  canBuyThread?: boolean;
  rsvpOnly?: boolean;
};

// ---------- MOMENTS ----------

export type CreateMomentPayload = {
  eventId: string;
  image: string;
  caption?: string;
};

export type UpdateMomentStatusPayload = {
  status: MomentStatus;
};

// ---------- THREADS ----------

export type ThreadItemPayload = {
  id?: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  category: string;
};

export type CreateThreadPayload = {
  eventId: string;
  accessTypeId: string;
  allowedCircleIds?: string[];
};

export type UpsertThreadPayload = {
  accessTypeId?: string;
  items: ThreadItemPayload[];
};

// ---------- INTERACTIONS ----------

export type InteractionToastPayload = {
  eventId: string;
  content: string;
  amount?: number;
};

export type InteractionMomentPayload = {
  eventId: string;
  image: string;
  caption?: string;
};

export type CheckInPayload = {
  eventId: string;
  userId?: string;
  guestId?: string;
};

// ---------- EVENTS: CIRCLE DELEGATION ----------

export type EventCirclePermissionsPayload = {
  canViewPrivateDetails?: boolean;
  canBuyThread?: boolean;
  rsvpOnly?: boolean;
  canCheckInTickets?: boolean;
};

// ---------- WALLET ----------

export type TopUpWalletPayload = {
  amount: number;
  callbackUrl?: string;
};

export type ConsumeResourcePayload = {
  resourceType: ResourceType;
  quantity: number;
  eventId?: string;
};

// ---------- PASS (QR) ----------

export type ScanQrPayload = {
  payload: string;
};

// ---------- EMAIL BROADCAST ----------

export type SendEventEmailPayload = {
  eventId: string;
  subject: string;
  content: string;
  recipientGuestIds?: string[];
  rsvpFilter?: RSVPStatus;
};

// ---------- PAYMENTS ----------

export type PurchaseStoragePayload = {
  eventId: string;
  mb: number;
  callbackUrl?: string;
};

// ---------- TICKETS ----------

export type LookupGuestTicketPayload = {
  reference: string;
  email: string;
};
