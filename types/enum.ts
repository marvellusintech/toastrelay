//////////////////////
// ENUMS
//////////////////////
export enum SocialProvider {
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE'
}


export enum TransactionType {
  TICKET = "TICKET",
  THREAD_CONTRIBUTION = "THREAD_CONTRIBUTION",
}

export enum PaymentIntentType {
  TICKET = "TICKET",
  THREAD_CONTRIBUTION = "THREAD_CONTRIBUTION",
}

export enum TransactionTargetType {
  TICKET = "TICKET",
  THREAD_PARTICIPATION = "THREAD_PARTICIPATION",
}

export enum PaymentProvider {
  PAYSTACK = "PAYSTACK",
  STRIPE = "STRIPE",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum RSVPStatus {
  PENDING = "PENDING",
  GOING = "GOING",
  NOT_GOING = "NOT_GOING",
  MAYBE = "MAYBE",
}

export enum MomentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum ParticipationStatus {
  INTERESTED = "INTERESTED",
  PAID = "PAID",
  CONFIRMED = "CONFIRMED",
}

export enum TicketStatus {
  VALID = "VALID",
  USED = "USED",
  CANCELLED = "CANCELLED",
}

export enum ThreadItemStatus {
  AVAILABLE = "AVAILABLE",
  SOLD_OUT = "SOLD_OUT",
}

export enum EventStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}