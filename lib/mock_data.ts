import {
  MomentStatus,
  ParticipationStatus,
  Role,
  RSVPStatus,
  ThreadItemStatus,
} from "../types/enum";
import { EventDetails, User } from "../types/response";

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


export const mockEventsList: EventDetails[] = [
  {
    id: "evt_001",
    name: "Bryson & Ada Wedding 2026",
    description: "A beautiful celebration of love, unity, and family with friends.",
    startDate: "2026-06-20T14:00:00.000Z",
    endDate: "2026-06-20T22:00:00.000Z",
    location: "Eko Convention Centre, Lagos",
    coverImage: "https://images.unsplash.com/photo-1529636798458-92182e662485", // Tall portrait image
    isPublic: true,
    createdAt: "2026-05-01T10:00:00.000Z",
    updatedAt: "2026-05-25T12:00:00.000Z",
    theme: { primaryColor: "#FF5CCB", backgroundColor: "#FFF", fontFamily: "Inter", isDark: false },
    template: { id: "t1", name: "Classic", description: "Elegant", preview: "", theme: { primaryColor: "#FF5CCB", backgroundColor: "#FFF", fontFamily: "Inter", isDark: false } },
    isCustomTheme: true,
    host: { id: "u1", firstName: "Marvellous", lastName: "Ife", photoUrl: "", role: Role.USER, email: "" },
    eventType: { id: "wedding", name: "Wedding", label: "Wedding Ceremony", icon: "💍" },
    toasts: [], moments: [], guests: [], circles: [], attendance: [], attendanceCount: 2, thread: { id: "", accessType: { id: "", name: "" }, allowedCircles: [], items: [] }, ticketEvent: null
  },
  {
    id: "evt_002",
    name: "Champions Trophy Finals Viewing Party",
    description: "Catch the match live on the ultra-wide screen with free food and drinks!",
    startDate: "2026-07-11T18:00:00.000Z",
    endDate: "2026-07-11T23:00:00.000Z",
    location: "Silverbird Galleria, Abuja",
    coverImage: "https://images.unsplash.com/photo-1777425939321-30c2dba85d0c", // Landscape aspect ratio
    isPublic: true,
    createdAt: "2026-05-01T10:00:00.000Z",
    updatedAt: "2026-05-25T12:00:00.000Z",
    theme: { primaryColor: "#EAB308", backgroundColor: "#000", fontFamily: "Inter", isDark: true },
    template: { id: "t2", name: "Sports", description: "Dark", preview: "", theme: { primaryColor: "#EAB308", backgroundColor: "#000", fontFamily: "Inter", isDark: true } },
    isCustomTheme: true,
    host: { id: "u2", firstName: "Alex", lastName: "Kofi", photoUrl: "", role: Role.USER, email: "" },
    eventType: { id: "sports", name: "Sports", label: "Viewing Party", icon: "⚽" },
    toasts: [], moments: [], guests: [], circles: [], attendance: [], attendanceCount: 150, thread: { id: "", accessType: { id: "", name: "" }, allowedCircles: [], items: [] }, ticketEvent: null
  },
  {
    id: "evt_003",
    name: "Ghana Style & Design Expo 2026",
    description: "Showcasing the premium aesthetics of West African runway design concepts.",
    startDate: "2024-09-05T09:00:00.000Z",
    endDate: "2024-09-07T18:00:00.000Z",
    location: "Accra International Conference Centre",
    coverImage: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b", // Very high vertical image
    isPublic: true,
    createdAt: "2026-05-01T10:00:00.000Z",
    updatedAt: "2026-05-25T12:00:00.000Z",
    theme: { primaryColor: "#059669", backgroundColor: "#FFF", fontFamily: "Inter", isDark: false },
    template: { id: "t3", name: "Fashion", description: "Minimal", preview: "", theme: { primaryColor: "#059669", backgroundColor: "#FFF", fontFamily: "Inter", isDark: false } },
    isCustomTheme: true,
    host: { id: "u3", firstName: "Kofi", lastName: "Mensah", photoUrl: "", role: Role.USER, email: "" },
    eventType: { id: "fashion", name: "Fashion", label: "Exhibition", icon: "✨" },
    toasts: [], moments: [], guests: [], circles: [], attendance: [], attendanceCount: 42, thread: { id: "", accessType: { id: "", name: "" }, allowedCircles: [], items: [] }, ticketEvent: null
  },
  {
    id: "evt_004",
    name: "Picnic 'n' Chill: End of Year Rave",
    description: "Games, Food, Networking, and Live performances by the beach side.",
    startDate: "2026-12-13T10:00:00.000Z",
    endDate: "2026-12-13T22:00:00.000Z",
    location: "Landmark Beach, Lagos",
    coverImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3", // Vibrant event photo
    isPublic: true,
    createdAt: "2026-05-01T10:00:00.000Z",
    updatedAt: "2026-05-25T12:00:00.000Z",
    theme: { primaryColor: "#06B6D4", backgroundColor: "#FFF", fontFamily: "Inter", isDark: false },
    template: { id: "t4", name: "Party", description: "Vibrant", preview: "", theme: { primaryColor: "#06B6D4", backgroundColor: "#FFF", fontFamily: "Inter", isDark: false } },
    isCustomTheme: true,
    host: { id: "u4", firstName: "Seyi", lastName: "Vibez", photoUrl: "", role: Role.USER, email: "" },
    eventType: { id: "party", name: "Party", label: "Beach Party", icon: "🏖️" },
    toasts: [], moments: [], guests: [], circles: [], attendance: [], attendanceCount: 890, thread: { id: "", accessType: { id: "", name: "" }, allowedCircles: [], items: [] }, ticketEvent: null
  },
  {
    id: "evt_005",
    name: "Tech Founders & Angel Investors Summit",
    description: "Connecting early-stage ecosystems with active venture capital networks.",
    startDate: "2026-08-15T09:00:00.000Z",
    endDate: "2026-08-15T17:00:00.000Z",
    location: "The Zone Tech Park, Gbagada",
    coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    isPublic: true,
    createdAt: "2026-05-01T10:00:00.000Z",
    updatedAt: "2026-05-25T12:00:00.000Z",
    theme: { primaryColor: "#2563EB", backgroundColor: "#FFF", fontFamily: "Inter", isDark: false },
    template: { id: "t5", name: "Corporate", description: "Clean", preview: "", theme: { primaryColor: "#2563EB", backgroundColor: "#FFF", fontFamily: "Inter", isDark: false } },
    isCustomTheme: true,
    host: { id: "u5", firstName: "Derah", lastName: "Chuks", photoUrl: "", role: Role.USER, email: "" },
    eventType: { id: "tech", name: "Tech", label: "Conference", icon: "💻" },
    toasts: [], moments: [], guests: [], circles: [], attendance: [], attendanceCount: 310, thread: { id: "", accessType: { id: "", name: "" }, allowedCircles: [], items: [] }, ticketEvent: null
  },
  {
    id: "evt_006",
    name: "Neon Lights & Tribal Rhythm Festival",
    description: "An electronic fusion of indigenous sounds mixed with deep techno beats.",
    startDate: "2026-10-31T20:00:00.000Z",
    endDate: "2026-11-01T04:00:00.000Z",
    location: "Freedom Park, Lagos Island",
    coverImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
    isPublic: true,
    createdAt: "2026-05-01T10:00:00.000Z",
    updatedAt: "2026-05-25T12:00:00.000Z",
    theme: { primaryColor: "#A855F7", backgroundColor: "#0F172A", fontFamily: "Inter", isDark: true },
    template: { id: "t6", name: "Concert", description: "Neon", preview: "", theme: { primaryColor: "#A855F7", backgroundColor: "#0F172A", fontFamily: "Inter", isDark: true } },
    isCustomTheme: true,
    host: { id: "u6", firstName: "DJ", lastName: "Tunez", photoUrl: "", role: Role.USER, email: "" },
    eventType: { id: "concert", name: "Concert", label: "Festival", icon: "🎸" },
    toasts: [], moments: [], guests: [], circles: [], attendance: [], attendanceCount: 1500, thread: { id: "", accessType: { id: "", name: "" }, allowedCircles: [], items: [] }, ticketEvent: null
  },
  {
    id: "evt_007",
    name: "Lagoon Luxe Wedding 2026",
    description: "A luxury waterfront wedding blending modern elegance with Yoruba heritage.",
    startDate: "2026-12-12T15:00:00.000Z",
    endDate: "2026-12-12T23:00:00.000Z",
    location: "Eko Atlantic, Lagos",
    coverImage: "https://images.unsplash.com/photo-1761405378603-633bd07633ac",
    isPublic: true,
    createdAt: "2026-06-01T10:00:00.000Z",
    updatedAt: "2026-06-10T12:00:00.000Z",
    theme: {
      primaryColor: "#F59E0B",
      backgroundColor: "#FFF7ED",
      fontFamily: "Playfair Display",
      isDark: false
    },
    template: {
      id: "t1",
      name: "Wedding",
      description: "Elegant",
      preview: "",
      theme: {
        primaryColor: "#F59E0B",
        backgroundColor: "#FFF7ED",
        fontFamily: "Playfair Display",
        isDark: false
      }
    },
    isCustomTheme: false,
    host: {
      id: "u7",
      firstName: "Amara",
      lastName: "Okafor",
      photoUrl: "",
      role: Role.USER,
      email: ""
    },
    eventType: {
      id: "wedding",
      name: "Wedding",
      label: "Wedding",
      icon: "💍"
    },
    toasts: [],
    moments: [],
    guests: [],
    circles: [],
    attendance: [],
    attendanceCount: 320,
    thread: { id: "", accessType: { id: "", name: "" }, allowedCircles: [], items: [] },
    ticketEvent: null
  },

  {
    id: "evt_008",
    name: "Startup Founders Meetup: Lagos Edition",
    description: "A networking night for founders, builders, and investors shaping Africa’s tech future.",
    startDate: "2026-09-18T17:00:00.000Z",
    endDate: "2026-09-18T21:00:00.000Z",
    location: "Victoria Island, Lagos",
    coverImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72",
    isPublic: true,
    createdAt: "2026-06-05T10:00:00.000Z",
    updatedAt: "2026-06-12T12:00:00.000Z",
    theme: {
      primaryColor: "#3B82F6",
      backgroundColor: "#0B1220",
      fontFamily: "Inter",
      isDark: true
    },
    template: {
      id: "t3",
      name: "Networking",
      description: "Startup",
      preview: "",
      theme: {
        primaryColor: "#3B82F6",
        backgroundColor: "#0B1220",
        fontFamily: "Inter",
        isDark: true
      }
    },
    isCustomTheme: false,
    host: {
      id: "u8",
      firstName: "Tobi",
      lastName: "Adewale",
      photoUrl: "",
      role: Role.USER,
      email: ""
    },
    eventType: {
      id: "tech",
      name: "Tech",
      label: "Networking",
      icon: "💡"
    },
    toasts: [],
    moments: [],
    guests: [],
    circles: [],
    attendance: [],
    attendanceCount: 210,
    thread: { id: "", accessType: { id: "", name: "" }, allowedCircles: [], items: [] },
    ticketEvent: null
  },

  {
    id: "evt_009",
    name: "Sunset Rooftop House Party",
    description: "A private rooftop experience with deep house, cocktails, and sunset vibes.",
    startDate: "2026-08-09T16:00:00.000Z",
    endDate: "2026-08-09T23:00:00.000Z",
    location: "Ikoyi Rooftops, Lagos",
    coverImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    isPublic: false,
    createdAt: "2026-06-08T10:00:00.000Z",
    updatedAt: "2026-06-15T12:00:00.000Z",
    theme: {
      primaryColor: "#EC4899",
      backgroundColor: "#111827",
      fontFamily: "Inter",
      isDark: true
    },
    template: {
      id: "t4",
      name: "Party",
      description: "Rooftop",
      preview: "",
      theme: {
        primaryColor: "#EC4899",
        backgroundColor: "#111827",
        fontFamily: "Inter",
        isDark: true
      }
    },
    isCustomTheme: true,
    host: {
      id: "u9",
      firstName: "Zainab",
      lastName: "Kareem",
      photoUrl: "",
      role: Role.USER,
      email: ""
    },
    eventType: {
      id: "party",
      name: "Party",
      label: "House Party",
      icon: "🍾"
    },
    toasts: [],
    moments: [],
    guests: [],
    circles: [],
    attendance: [],
    attendanceCount: 85,
    thread: { id: "", accessType: { id: "", name: "" }, allowedCircles: [], items: [] },
    ticketEvent: null
  },

  {
    id: "evt_010",
    name: "Code & Coffee Hack Night",
    description: "Build, break, and ship ideas overnight with developers over coffee and snacks.",
    startDate: "2026-07-20T18:00:00.000Z",
    endDate: "2026-07-21T06:00:00.000Z",
    location: "Cowork Hub, Benin City",
    coverImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    isPublic: true,
    createdAt: "2026-06-10T10:00:00.000Z",
    updatedAt: "2026-06-18T12:00:00.000Z",
    theme: {
      primaryColor: "#22C55E",
      backgroundColor: "#0A0F0D",
      fontFamily: "JetBrains Mono",
      isDark: true
    },
    template: {
      id: "t2",
      name: "Hackathon",
      description: "Dev Night",
      preview: "",
      theme: {
        primaryColor: "#22C55E",
        backgroundColor: "#0A0F0D",
        fontFamily: "JetBrains Mono",
        isDark: true
      }
    },
    isCustomTheme: false,
    host: {
      id: "u10",
      firstName: "Marvelous",
      lastName: "Ifeanyi",
      photoUrl: "",
      role: Role.USER,
      email: ""
    },
    eventType: {
      id: "hackathon",
      name: "Hackathon",
      label: "Tech Event",
      icon: "💻"
    },
    toasts: [],
    moments: [],
    guests: [],
    circles: [],
    attendance: [],
    attendanceCount: 95,
    thread: { id: "", accessType: { id: "", name: "" }, allowedCircles: [], items: [] },
    ticketEvent: null
  },
  {
  id: "evt_011",
  name: "Afro Streetwear Pop-Up & Fashion Night",
  description: "A bold showcase of African streetwear brands, live models, and DJ sets.",
  startDate: "2026-09-05T16:00:00.000Z",
  endDate: "2026-09-05T22:00:00.000Z",
  location: "Lekki Phase 1, Lagos",
  coverImage: "https://images.unsplash.com/photo-1520975916090-3105956dac38",
  isPublic: true,
  createdAt: "2026-06-12T10:00:00.000Z",
  updatedAt: "2026-06-14T12:00:00.000Z",
  theme: {
    primaryColor: "#EF4444",
    backgroundColor: "#0B0B0F",
    fontFamily: "Inter",
    isDark: true
  },
  template: { id: "t7", name: "Fashion", description: "Streetwear", preview: "", theme: { primaryColor: "#EF4444", backgroundColor: "#0B0B0F", fontFamily: "Inter", isDark: true } },
  isCustomTheme: true,
  host: { id: "u11", firstName: "Kemi", lastName: "Styles", photoUrl: "", role: Role.USER, email: "" },
  eventType: { id: "fashion", name: "Fashion", label: "Runway", icon: "👗" },
  toasts: [], moments: [], guests: [], circles: [], attendance: [],
  attendanceCount: 410,
  thread: { id: "", accessType: { id: "", name: "" }, allowedCircles: [], items: [] },
  ticketEvent: null
},

{
  id: "evt_012",
  name: "Midnight Jazz & Whiskey Lounge",
  description: "Smooth jazz performances paired with premium whiskey tasting.",
  startDate: "2026-08-22T19:00:00.000Z",
  endDate: "2026-08-23T02:00:00.000Z",
  location: "Ikeja GRA, Lagos",
  coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819",
  isPublic: true,
  createdAt: "2026-06-15T10:00:00.000Z",
  updatedAt: "2026-06-18T12:00:00.000Z",
  theme: {
    primaryColor: "#F59E0B",
    backgroundColor: "#0A0A0A",
    fontFamily: "Playfair Display",
    isDark: true
  },
  template: { id: "t8", name: "Lounge", description: "Jazz Night", preview: "", theme: { primaryColor: "#F59E0B", backgroundColor: "#0A0A0A", fontFamily: "Playfair Display", isDark: true } },
  isCustomTheme: true,
  host: { id: "u12", firstName: "Miles", lastName: "Events", photoUrl: "", role: Role.USER, email: "" },
  eventType: { id: "music", name: "Music", label: "Jazz", icon: "🎷" },
  toasts: [], moments: [], guests: [], circles: [], attendance: [],
  attendanceCount: 180,
  thread: { id: "", accessType: { id: "", name: "" }, allowedCircles: [], items: [] },
  ticketEvent: null
},

{
  id: "evt_013",
  name: "Tech Builders Summit Africa",
  description: "A deep dive into scaling startups, product engineering, and AI systems.",
  startDate: "2026-10-10T09:00:00.000Z",
  endDate: "2026-10-10T18:00:00.000Z",
  location: "Eko Hotel & Suites, Lagos",
  coverImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
  isPublic: true,
  createdAt: "2026-06-16T10:00:00.000Z",
  updatedAt: "2026-06-19T12:00:00.000Z",
  theme: {
    primaryColor: "#3B82F6",
    backgroundColor: "#0B1220",
    fontFamily: "Inter",
    isDark: true
  },
  template: { id: "t9", name: "Conference", description: "Tech Summit", preview: "", theme: { primaryColor: "#3B82F6", backgroundColor: "#0B1220", fontFamily: "Inter", isDark: true } },
  isCustomTheme: false,
  host: { id: "u13", firstName: "Ayo", lastName: "Tech", photoUrl: "", role: Role.USER, email: "" },
  eventType: { id: "conference", name: "Conference", label: "Summit", icon: "🏢" },
  toasts: [], moments: [], guests: [], circles: [], attendance: [],
  attendanceCount: 1200,
  thread: { id: "", accessType: { id: "", name: "" }, allowedCircles: [], items: [] },
  ticketEvent: null
},

{
  id: "evt_014",
  name: "Private Yacht Birthday Experience",
  description: "An exclusive birthday celebration on a luxury yacht with live DJ and sunset cruise.",
  startDate: "2026-11-15T14:00:00.000Z",
  endDate: "2026-11-15T20:00:00.000Z",
  location: "Atlantic Ocean Cruise, Lagos",
  coverImage: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
  isPublic: false,
  createdAt: "2026-06-18T10:00:00.000Z",
  updatedAt: "2026-06-20T12:00:00.000Z",
  theme: {
    primaryColor: "#06B6D4",
    backgroundColor: "#06121A",
    fontFamily: "Inter",
    isDark: true
  },
  template: { id: "t10", name: "Luxury", description: "Yacht Party", preview: "", theme: { primaryColor: "#06B6D4", backgroundColor: "#06121A", fontFamily: "Inter", isDark: true } },
  isCustomTheme: true,
  host: { id: "u14", firstName: "Victor", lastName: "Luxe", photoUrl: "", role: Role.USER, email: "" },
  eventType: { id: "birthday", name: "Birthday", label: "Luxury Party", icon: "🎂" },
  toasts: [], moments: [], guests: [], circles: [], attendance: [],
  attendanceCount: 45,
  thread: { id: "", accessType: { id: "", name: "" }, allowedCircles: [], items: [] },
  ticketEvent: null
},

{
  id: "evt_015",
  name: "Faith & Worship Night Live",
  description: "A powerful night of worship, live choir performances, and spiritual connection.",
  startDate: "2026-07-30T17:00:00.000Z",
  endDate: "2026-07-30T21:00:00.000Z",
  location: "Church Auditorium, Benin City",
  coverImage: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65",
  isPublic: true,
  createdAt: "2026-06-20T10:00:00.000Z",
  updatedAt: "2026-06-21T12:00:00.000Z",
  theme: {
    primaryColor: "#22C55E",
    backgroundColor: "#07130B",
    fontFamily: "Inter",
    isDark: true
  },
  template: { id: "t11", name: "Worship", description: "Faith Night", preview: "", theme: { primaryColor: "#22C55E", backgroundColor: "#07130B", fontFamily: "Inter", isDark: true } },
  isCustomTheme: false,
  host: { id: "u15", firstName: "Pastor", lastName: "Hope", photoUrl: "", role: Role.USER, email: "" },
  eventType: { id: "faith", name: "Faith", label: "Worship", icon: "🙏" },
  toasts: [], moments: [], guests: [], circles: [], attendance: [],
  attendanceCount: 980,
  thread: { id: "", accessType: { id: "", name: "" }, allowedCircles: [], items: [] },
  ticketEvent: null
}

];