//////////////////////
// TYPES & RELATIONS
//////////////////////

import {
  MomentStatus,
  ParticipationStatus,
  PaymentIntentType,
  PaymentProvider,
  PaymentStatus,
  ResourceType,
  Role,
  RSVPStatus,
  ThreadItemStatus,
  TicketStatus,
  TransactionTargetType,
  TransactionType,
  WalletTransactionType,
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
  // template: EventTemplate;
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
  externalUrl: string | null;
  format: "PHYSICAL" | "ONLINE" | "HYBRID";
  onlineUrl: string | null;
  allowRsvp: boolean;
  allowMoments: boolean;
  allowToasts: boolean;
  currency: string;
  claimStatus: string;
  createdByUserId: string;

  _count: EventCount;
};

export interface EventCount {
    guests: number;
    views:  number;
}

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

export interface QucikData {
  totalEvents: number;
  ticketsSold: number;
  totalRevenue: number;
  totalRsvps: number;
}

export interface RevenueTrend {
  date: string;
  totalRevenue: number;
  ticketRevenue: number;
  contributionRevenue: number;
}

//////////////////////
// CIRCLES (OWNED)
//////////////////////

export type Circle = {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  _count?: { members: number };
  members?: Array<{
    id: string;
    circleId: string;
    userId: string;
    user: Pick<User, "id" | "firstName" | "lastName" | "email" | "photo">;
  }>;
};

//////////////////////
// MOMENTS (API SHAPE)
//////////////////////

export type MomentRecord = {
  id: string;
  eventId: string;
  uploaderId: string;
  image: string;
  caption: string | null;
  status: MomentStatus;
  createdAt: string;
  uploader: Pick<User, "id" | "firstName" | "lastName" | "photo">;
};

//////////////////////
// TOASTS (API SHAPE)
//////////////////////

export type ToastRecord = {
  id: string;
  eventId: string;
  authorId: string | null;
  guestId: string | null;
  authorName: string | null;
  content: string;
  amount: number | string | null;
  paymentId: string | null;
  createdAt: string;
  author: Pick<User, "id" | "firstName" | "lastName" | "photo"> | null;
};

//////////////////////
// THREADS (API SHAPE)
//////////////////////

export type ThreadAccessType = {
  id: string;
  name: string;
};

export type ThreadDetail = {
  id: string;
  eventId: string;
  accessTypeId: string;
  accessType: ThreadAccessType;
  items: Array<{
    id: string;
    threadId: string;
    name: string;
    description: string | null;
    price: number | string;
    image: string;
    category: string;
    status: ThreadItemStatus;
    createdAt: string;
    updatedAt: string;
  }>;
  allowedCircles: Array<{
    id: string;
    threadId: string;
    circleId: string;
    circle: Pick<Circle, "id" | "name" | "description">;
  }>;
};

export type EventCircle = {
  id: string;
  eventId: string;
  circleId: string;
  canViewPrivateDetails: boolean;
  canBuyThread: boolean;
  rsvpOnly: boolean;
  canCheckInTickets: boolean;
  circle?: Pick<Circle, "id" | "name" | "description">;
};

//////////////////////
// WALLET
//////////////////////

export type WalletEntry = {
  id: string;
  walletId: string;
  type: WalletTransactionType;
  amount: number | string;
  resourceType: ResourceType | null;
  eventId: string | null;
  description: string | null;
  reference: string | null;
  paymentId: string | null;
  createdAt: string;
};

export type Wallet = {
  id: string;
  userId: string;
  balance: number | string;
  entries: WalletEntry[];
  createdAt: string;
  updatedAt: string;
};

export type TopUpWalletResult = {
  paymentId: string;
  reference: string;
  amount: number;
  authorizationUrl: string;
  accessCode: string;
};

export type ConsumeResourceResult = WalletEntry;

//////////////////////
// PASS (QR)
//////////////////////

export type EventPass = {
  type: "TICKET" | "RSVP";
  attendee: {
    name: string;
    detail?: string | null;
  };
  payload: string;
};

export type ScanCheckInResult =
  | {
      type: "TICKET";
      attendee: string;
      tier: string;
      ticketId: string;
      status: string;
      checkedInAt: string;
    }
  | {
      type: "RSVP";
      attendee: string;
      rsvpStatus: string;
      guestId: string;
      checkedInAt: string;
    };

//////////////////////
// EMAIL BROADCAST
//////////////////////

export type SendEventEmailResult = {
  eventId: string;
  totalRecipients: number;
  sent: number;
  failed: number;
  costCredits: number;
  freeEmailsUsed: number;
  freeEmailsRemaining: number;
};

//////////////////////
// PAYMENTS
//////////////////////

export type PurchaseStorageResult = {
  paymentId: string;
  reference: string;
  amount: number;
  currency: string;
  storageMb?: number;
  costCredits?: number;
  total?: number;
  authorizationUrl: string;
  accessCode: string;
};

export type InitializePaymentResult = {
  paymentId: string;
  reference: string;
  amount: number;
  currency: string;
  quantity?: number;
  ticketSubtotal?: number;
  serviceFee?: number;
  storageMb?: number;
  costCredits?: number;
  total?: number;
  authorizationUrl: string;
  accessCode: string;
};

//////////////////////
// TICKETS: GUEST LOOKUP
//////////////////////

export type LookupGuestTicketResult = {
  tickets: Array<{
    ticketId: string;
    tier: string | null;
    status: TicketStatus;
    qrPayload: string;
  }>;
};
