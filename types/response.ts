//////////////////////
// TYPES & RELATIONS
//////////////////////

import {
  MomentStatus,
  ParticipationStatus,
  PaymentIntentType,
  PaymentProvider,
  PaymentStatus,
  Role,
  RSVPStatus,
  ThreadItemStatus,
  TicketStatus,
  TransactionTargetType,
  TransactionType,
} from "./enum";

// minimal user info for event details page (used for host, toasts, moments, etc)
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerifiedAt: Date;
  photo: null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export type EventType = {
  id: string;
  name: string;
  label: string | null;
};

export type Toast = {
  id: string;
  content: string;
  amount: number | null;
  createdAt: string;
  author: User;
};

export type Moment = {
  id: string;
  imageUrl: string;
  caption: string | null;
  status: MomentStatus;
  createdAt: string;
  uploader: Pick<User, "firstName" | "lastName">;
};

export type Guest = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  rsvpStatus: RSVPStatus;
  category: {
    id: string;
    label: string | null;
  };
};

export type ThreadParticipation = {
  id: string;
  userId: string;
  status: ParticipationStatus;
  paidAmount: number;
};

export type ThreadItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string;
  category: string;
  status: ThreadItemStatus;
  participants: ThreadParticipation[];
};

export type Thread = {
  id: string;

  accessType: {
    id: string;
    name: string;
  };

  allowedCircles: {
    id: string;
    name: string;
  }[];

  items: ThreadItem[];
};

export type TicketTier = {
  id: string;
  name: string;
  price: number;
  capacity: number;
  sold: number;

  remaining: number;
};

export type TicketEvent = {
  id: string;

  tiers: TicketTier[];

  totalSold: number;
  revenue: number;
};

export interface EventTheme {
  primaryColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  isDark?: boolean;
  [key: string]: unknown; // 👈 Allows flexibility for extra custom fields safely
}

export type Circles = {
  id: string;
  name: string;
  description: string | null;

  canViewPrivateDetails: boolean;
  canBuyAsoEbi: boolean;
  rsvpOnly: boolean;
};

export type EventAttendance = {
  id: string;
  checkedInAt: string;

  user?: Pick<User, "id" | "firstName" | "lastName" | "photo">;
  guest?: Guest;
};

export type EventTemplate = {
  id: string;
  name: string;
  description: string | null;
  preview: string | null;

  theme: {
    primaryColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
    isDark?: boolean;
    [key: string]: unknown;
  };
};

export type EventDetails = {
  id: string;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date | undefined;
  location: string | null;
  coverImage: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  theme: EventTheme | null;
  template: EventTemplate;
  isCustomTheme: boolean;
  host: User;
  eventType: EventType;
  toasts: Toast[];
  moments: Moment[];
  guests: Guest[];

  circles: Circles[];
  attendance: EventAttendance[];
  attendanceCount: number;

  thread: Thread | null;
  ticketEvent: TicketEvent | null;

  status: string;

  extraMedia: [];
  slug: string;
  eventTypeId: null | string;
  templateId: null | string;
  hostId: string;
  isExternal: boolean;
  externalUrl: null;
  claimStatus: string;
  createdByUserId: string;
};

//////////////////////
// TRANSACTION & PAYMENT TYPES
//////////////////////

export type TicketMin = {
  id: string;
  tierName: string;
  status: TicketStatus;
  checkedInAt: string | null;
};

export type TransactionMin = {
  id: string;
  type: TransactionType;
  targetType: TransactionTargetType;
};

export type UserPayment = {
  id: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  reference: string;
  status: PaymentStatus;
  intentType: PaymentIntentType;
  createdAt: string;
  tickets?: TicketMin[];
  transaction: TransactionMin | null;
};
