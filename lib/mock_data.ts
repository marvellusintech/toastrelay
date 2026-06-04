import {
  MomentStatus,
  ParticipationStatus,
  Role,
  RSVPStatus,
  ThreadItemStatus,
} from "./types/enum";
import { EventDetails, User } from "./types/response";

// 1. Current Active User Profile (The Frontend Session)
export const mockCurrentUser: User = {
  id: "usr_buyer_1",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  role: Role.USER,
};

export const mockEventDetails: EventDetails = {
  id: "evt_001",

  name: "Bryson & Ada Wedding 2026",
  description:
    "A beautiful celebration of love, unity, and family with friends and well-wishers.",
  startDate: "2026-06-20T14:00:00.000Z",
  endDate: "2026-06-20T22:00:00.000Z",
  location: "Eko Convention Centre, Lagos",
  coverImage: "https://images.unsplash.com/photo-1529636798458-92182e662485",

  isPublic: true,

  createdAt: "2026-05-01T10:00:00.000Z",
  updatedAt: "2026-05-25T12:00:00.000Z",

  theme: {
    primaryColor: "#FF5CCB",
    backgroundColor: "#FFF",
    fontFamily: "Inter",
    isDark: false,
  },
  template: {
    id: "template_wedding_classic",
    name: "Classic Wedding Template",
    description: "Elegant and timeless wedding event layout",
    preview: "https://images.unsplash.com/photo-1519225421980-715cb0215aed",

    theme: {
      primaryColor: "#AE5CEB",
      backgroundColor: "#FFF",
      fontFamily: "Playfair Display",
      isDark: false,
    },
  },

  isCustomTheme: true,

  host: {
    id: "user_1",
    firstName: "Marvellous",
    lastName: "Ifeanyichukwu",
    photoUrl: "https://i.pravatar.cc/150?img=12",
    role: Role.USER,
    email: "marvellous@example.com",
  },

  eventType: {
    id: "wedding",
    name: "Wedding",
    label: "Wedding Ceremony",
    icon: "💍",
  },

  toasts: [
    {
      id: "toast_1",
      content: "Congratulations! Wishing you a lifetime of happiness 💕",
      amount: 5000,
      createdAt: "2026-05-21T09:00:00.000Z",
      author: {
        id: "user_2",
        firstName: "Ada",
        lastName: "Okafor",
        photoUrl: "https://i.pravatar.cc/150?img=5",
      },
    },
  ],

  moments: [
    {
      id: "moment_1",
      imageUrl: "https://images.unsplash.com/photo-1523438097201-512ae7d59c1f",
      caption: "Beautiful setup before guests arrived",
      status: MomentStatus.APPROVED,
      createdAt: "2026-05-22T10:00:00.000Z",
      uploader: {
        firstName: "John",
        lastName: "Doe",
      },
    },
  ],

  guests: [
    {
      id: "guest_1",
      name: "Chinedu Emeka",
      email: "chinedu@example.com",
      phone: "08012345678",
      rsvpStatus: RSVPStatus.GOING,
      category: {
        id: "cat_vip",
        label: "VIP",
      },
    },
    {
      id: "guest_2",
      name: "Sarah Johnson",
      email: null,
      phone: null,
      rsvpStatus: RSVPStatus.PENDING,
      category: {
        id: "cat_regular",
        label: "Regular Guest",
      },
    },
  ],

  circles: [
    {
      id: "circle_1",
      name: "Family",
      description: "Immediate family members",
      canViewPrivateDetails: true,
      canBuyAsoEbi: true,
      rsvpOnly: false,
    },
    {
      id: "circle_2",
      name: "Friends",
      description: "Close friends circle",
      canViewPrivateDetails: false,
      canBuyAsoEbi: true,
      rsvpOnly: true,
    },
  ],

  attendance: [
    {
      id: "att_1",
      checkedInAt: "2026-06-20T15:10:00.000Z",
      user: {
        id: "user_3",
        firstName: "Michael",
        lastName: "Adebayo",
        photoUrl: "https://i.pravatar.cc/150?img=8",
      },
    },
    {
      id: "att_2",
      checkedInAt: "2026-06-20T15:20:00.000Z",
      guest: {
        id: "guest_1",
        name: "Chinedu Emeka",
        email: "chinedu@example.com",
        rsvpStatus: RSVPStatus.GOING,
        phone: null,
        category: {
          id: "cat_vip",
          label: "VIP",
        },
      },
    },
  ],

  attendanceCount: 2,

  thread: {
    id: "thread_1",
    accessType: {
      id: "public",
      name: "Public",
    },
    allowedCircles: [
      {
        id: "circle_1",
        name: "Family",
      },
    ],
    items: [
      {
        id: "item_1",
        name: "Aso-Ebi Lace",
        description: "Premium lace fabric for wedding guests",
        price: 25000,
        imageUrl:
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf",
        category: "fabric",
        status: ThreadItemStatus.AVAILABLE,
        participants: [
          {
            id: "part_1",
            userId: "user_2",
            status: ParticipationStatus.PAID,
            paidAmount: 25000,
          },
        ],
      },
    ],
  },

  ticketEvent: {
    id: "ticket_1",
    tiers: [
      {
        id: "tier_1",
        name: "Regular",
        price: 10000,
        capacity: 200,
        sold: 120,
        remaining: 80,
      },
      {
        id: "tier_2",
        name: "VIP",
        price: 50000,
        capacity: 50,
        sold: 30,
        remaining: 20,
      },
    ],
    totalSold: 150,
    revenue: 1000000,
  },
};
