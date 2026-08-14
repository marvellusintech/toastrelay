"use client";

import * as React from "react";
import {
  CalendarDays,
  MapPin,
  Users,
  MessageSquareHeart,
  Camera,
  Ticket,
  Gift,
  Globe,
  Lock,
  Clock,
  Heart,
  ChevronLeft,
  BarChart3,
  ImageIcon,
  Link as LinkIcon,
  ExternalLink,
  ShieldCheck,
  FileText,
  Palette,
  Tag,
  Hash,
  ScanLine,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { EventDetails } from "@/types/response";
import { ThreadItemStatus } from "@/types/enum";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { cn, formatDate, formatCurrency } from "@/lib/utils";
import { getInitials } from "@/lib/utils/helpers";
import { getFileUrl } from "@/lib/utils/getFileUrl";

interface EventDetailsPageProps {
  event: EventDetails;
}

// ─── Helpers ──────────────────────────────────────────────────────

const RSVP_STYLES: Record<string, { label: string; class: string }> = {
  GOING: { label: "Going", class: "bg-emerald-50 text-emerald-600" },
  MAYBE: { label: "Maybe", class: "bg-amber-50 text-amber-600" },
  NOT_GOING: { label: "Not Going", class: "bg-red-50 text-red-600" },
  PENDING: { label: "Pending", class: "bg-neutral-100 text-neutral-500" },
};

const STATUS_STYLES: Record<string, { label: string; class: string }> = {
  DRAFT: { label: "Draft", class: "bg-amber-50 text-amber-700" },
  PUBLISHED: { label: "Published", class: "bg-emerald-50 text-emerald-700" },
  COMPLETED: { label: "Completed", class: "bg-blue-50 text-blue-700" },
  CANCELLED: { label: "Cancelled", class: "bg-red-50 text-red-700" },
};

function checkIsVideo(url?: string | null) {
  if (!url) return false;
  const exts = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];
  return exts.some((e) => url.toLowerCase().includes(e));
}

function MediaEl({
  url,
  alt = "",
  cover = false,
}: {
  url: string;
  alt?: string;
  cover?: boolean;
}) {
  const src = getFileUrl(url);
  const isVideo = checkIsVideo(url);

  if (isVideo) {
    return (
      <video
        src={src}
        controls
        muted
        loop={!cover}
        playsInline
        className={cn(
          "h-full w-full",
          cover ? "object-cover" : "object-contain bg-black/5",
        )}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
    />
  );
}

// ─── Empty State ──────────────────────────────────────────────────

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

// ─── Detail Row ──────────────────────────────────────────────────

function DetailRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-3 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className="mt-0.5 text-sm text-foreground">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-turquoise underline underline-offset-2 hover:text-turquoise-dark"
            >
              {value}
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          ) : (
            value
          )}
        </div>
      </div>
    </div>
  );

  return inner;
}

// ─── Lightbox ─────────────────────────────────────────────────────

function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = React.useState(initialIndex);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] max-w-5xl flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="self-end rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex max-h-[65vh] items-center justify-center">
          <MediaEl url={images[idx]} alt={`Media ${idx + 1}`} />
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((url, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={cn(
                  "h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition",
                  idx === i
                    ? "border-white"
                    : "border-transparent opacity-50 hover:opacity-80",
                )}
              >
                <MediaEl url={url} alt={`Thumb ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Analytics Card ───────────────────────────────────────────────

function AnalyticsCard({ event }: { event: EventDetails }) {
  const totalToasts = event.toasts?.length ?? 0;
  const totalGuests = event._count?.guests ?? event.guests?.length ?? 0;
  const totalViews = event._count?.views ?? event.attendanceCount ?? 0;
  const revenue = event.ticketEvent?.revenue ?? 0;

  const weekData = [
    { label: "W1", value: Math.max(totalToasts, 1) * 1.2 },
    { label: "W2", value: Math.max(totalToasts, 1) * 2.1 },
    { label: "W3", value: Math.max(totalToasts, 1) * 1.8 },
    { label: "W4", value: Math.max(totalToasts, 1) * 3.4 },
  ];
  const maxVal = Math.max(...weekData.map((d) => d.value), 1);

  return (
    <Card className="px-6 py-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-5 w-5 text-coral" />
        <h2 className="text-xl font-semibold">Event pulse</h2>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Views
          </p>
          <p className="mt-1 text-3xl font-black font-display text-foreground">
            {totalViews}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Toasts
          </p>
          <p className="mt-1 text-3xl font-black font-display text-coral">
            {totalToasts}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Guests
          </p>
          <p className="mt-1 text-3xl font-black font-display text-foreground">
            {totalGuests}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Revenue
          </p>
          <p className="mt-1 text-3xl font-bold font-body text-gold">
            {formatCurrency(revenue)}
          </p>
        </div>
      </div>

      <Separator className="my-6" />

      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Activity (last 4 weeks)
        </p>
        <div className="grid h-48 items-end gap-3 sm:grid-cols-4">
          {weekData.map((d) => (
            <div key={d.label} className="flex h-full flex-col justify-end gap-2">
              <div
                className="w-full rounded-md bg-turquoise transition-all"
                style={{ height: `${(d.value / maxVal) * 100}%` }}
              />
              <p className="text-center text-xs font-bold text-muted-foreground">
                {d.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────

export function EventDetailsPage({ event }: EventDetailsPageProps) {
  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxIdx, setLightboxIdx] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("toasts");
  const [parentTab, setParentTab] = React.useState<"details" | "pulse">("details");

  const allMedia = React.useMemo(() => {
    const media: string[] = [];
    if (event.coverImage) media.push(event.coverImage);
    if (event.extraMedia?.length) media.push(...event.extraMedia);
    return media;
  }, [event.coverImage, event.extraMedia]);

  const openLightbox = (index: number) => {
    setLightboxIdx(index);
    setLightboxOpen(true);
  };

  const statusStyle = STATUS_STYLES[event.status] ?? STATUS_STYLES.DRAFT;

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/events/${event.slug}`
      : `/events/${event.slug}`;

  const TABS = [
    { value: "toasts", label: "Toasts", icon: MessageSquareHeart },
    { value: "guests", label: "Guests", icon: Users },
    { value: "moments", label: "Moments", icon: Camera },
    { value: "pass", label: "Tickets", icon: Ticket },
    { value: "thread", label: "Thread", icon: Gift },
    { value: "check-ins", label: "Check-ins", icon: Clock },
  ] as const;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-foreground ">
      {/* ── Top bar ─────────────────────────────── */}
      <div className="">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 lg:px-10">
          <Button
            onClick={() => router.back()}
            size="sm"
            variant="ghost"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-3">

            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/events/${event.id}/check-in`}>
                <ScanLine className="h-4 w-4" />
                Scan check-in
              </Link>
            </Button>
            <Button variant="secondary" asChild size="sm">
              <Link
                href={`/dashboard/events/${event.id}/setup?step=logistics`}
              >
                Edit
              </Link>
            </Button>
          </div>
        </div>

      </div>

        {/* ── Event Header (always visible) ─────────────────── */}
        <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
            {/* Event name — no card, no border */}
            <h1 className="text-3xl font-black font-display uppercase tracking-tight sm:text-4xl md:text-5xl">
              {event.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {event.startDate && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-turquoise" />
                  {new Date(event.startDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {event.endDate &&
                    ` — ${new Date(event.endDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}`}
                </span>
              )}
              {event.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-turquoise" />
                  {event.location}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                {event.isPublic ? (
                  <>
                    <Globe className="h-4 w-4 text-turquoise" /> Public
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 text-turquoise" /> Private
                  </>
                )}
              </span>

                          <span
              className={cn(
                "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider",
                statusStyle.class,
              )}
            >
              {statusStyle.label}
            </span>
            </div>

            {event.eventType?.label && (
              <span className="mt-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                {event.eventType.label}
              </span>
            )}

            {/* Description — below name, proper spacing */}
            {event.description && (
              <div className="mt-6 border-t border-line pt-6">
                <div
                  className="text-sm leading-relaxed text-muted-foreground prose prose-neutral"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>
            )}
        </div>

        {/* ── Parent Tabs ─────────────────────────── */}
        <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-10">
          <div className="inline-flex items-center gap-1 rounded-full border border-line bg-white p-1 shadow-sm">
            {(["details", "pulse"] as const).map((p) => {
              const isActive = parentTab === p;
              return (
                <button
                  key={p}
                  onClick={() => setParentTab(p)}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-semibold transition",
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {p === "details" ? "Event Details" : "Event Pulse"}
                </button>
              );
            })}
          </div>
        </div>

         {/* ── Media + Content ────────────────────── */}
      <div className="mx-auto max-w-7xl pt-10 px-6 pb-24 lg:px-10">
        {parentTab === "details" && (
          <>

                {/* ── Event Details Grid ─────────────────── */}
        <Card className="mb-6 px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-5 w-5 text-turquoise" />
            <h2 className="text-xl font-semibold">Details</h2>
          </div>

          <div className="grid gap-x-10 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* Dates */}
            <DetailRow
              icon={CalendarDays}
              label="Start date"
              value={
                event.startDate
                  ? new Date(event.startDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Not set"
              }
            />
            {event.endDate && (
              <DetailRow
                icon={CalendarDays}
                label="End date"
                value={new Date(event.endDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
            )}
            <DetailRow
              icon={MapPin}
              label="Location"
              value={event.location || "Not set"}
            />
            <DetailRow
              icon={event.isPublic ? Globe : Lock}
              label="Visibility"
              value={event.isPublic ? "Public" : "Private"}
            />
            <DetailRow
              icon={Tag}
              label="Event type"
              value={event.eventType?.label ?? event.eventType?.name ?? "Not set"}
            />
            <DetailRow
              icon={Hash}
              label="Slug"
              value={event.slug}
            />
            {event.isExternal && event.externalUrl && (
              <DetailRow
                icon={ExternalLink}
                label="External URL"
                value={event.externalUrl}
                href={event.externalUrl}
              />
            )}
            <DetailRow
              icon={Palette}
              label="Template"
              value={event.templateId || "Default"}
            />
          </div>

          {/* ── Circles ─────────────────────── */}
          {event.circles && event.circles.length > 0 && (
            <>
              <Separator className="my-6" />
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="h-5 w-5 text-turquoise" />
                  <h3 className="text-sm font-bold text-foreground">
                    Circles ({event.circles.length})
                  </h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {event.circles.map((circle) => (
                    <div
                      key={circle.id}
                      className="rounded-xl border border-line bg-panel p-4"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {circle.name}
                      </p>
                      {circle.description && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {circle.description}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {circle.canViewPrivateDetails && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            Private details
                          </span>
                        )}
                        {circle.canBuyAsoEbi && (
                          <span className="rounded-full bg-coral/10 px-2 py-0.5 text-[10px] font-semibold text-coral">
                            Can buy
                          </span>
                        )}
                        {circle.rsvpOnly && (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                            RSVP only
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Public URL ──────────────────── */}
          {event.status !== "DRAFT" && event.slug && (
            <>
              <Separator className="my-6" />
<div className="flex items-center justify-between rounded-xl bg-primary/5 px-5 py-4">
  <div className="flex items-center gap-3 min-w-0">
    <LinkIcon className="h-5 w-5 shrink-0 text-primary" />
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Public event page
      </p>
      <a
        href={publicUrl}
        target="_blank"
        rel="noopener noreferrer"
        suppressHydrationWarning
        className="mt-0.5 inline-flex max-w-full items-center gap-1 overflow-x-auto whitespace-nowrap text-sm font-medium text-turquoise underline underline-offset-2 hover:text-turquoise-dark [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {publicUrl}
        <ExternalLink className="h-3 w-3 shrink-0" />
      </a>
    </div>
  </div>
</div>
            </>
          )}
        </Card>

        {/* ── Cover + Media ───────────────────────── */}
          <div className="w-full lg:w-[55%] lg:sticky lg:top-20 lg:self-start">
            {/* Cover — prominent, by itself */}
            {event.coverImage && (
              <div className="relative h-64 overflow-hidden rounded-xl lg:rounded-4xl bg-muted shadow-sm sm:h-80 lg:h-[400px]">
                <button
                  onClick={() => openLightbox(0)}
                  className="block h-full w-full"
                >
                  <MediaEl url={event.coverImage} alt={event.name} cover />
                </button>
              </div>
            )}

            {/* Extra media grid — below cover */}
            {event.extraMedia && event.extraMedia.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {event.extraMedia.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => openLightbox(i + 1)}
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-muted shadow-sm transition hover:shadow-md"
                  >
                    <MediaEl url={url} alt={`Media ${i + 1}`} />
                    <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                  </button>
                ))}
              </div>
            )}
          </div>

  

          </>
        )}

        {parentTab === "pulse" && (
          <>

        {/* ── Analytics ─────────────────────────── */}
        <div >
          <AnalyticsCard event={event} />
        </div>

        {/* ── Tabs ──────────────────────────────── */}
        <div className="mt-10">
          <div className="flex gap-6 overflow-x-auto border-b border-line">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "flex items-center gap-2 border-b-2 pb-3 text-[11px] font-bold uppercase tracking-wider transition shrink-0",
                  activeTab === tab.value
                    ? "border-turquoise text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {/* ── Toasts ─────────────────── */}
            {activeTab === "toasts" && (
              <>
                {!event.toasts?.length ? (
                  <EmptyState
                    icon={MessageSquareHeart}
                    title="No toasts yet"
                    description="Guests haven't left messages yet."
                  />
                ) : (
                  <div className="mx-auto max-w-2xl space-y-6">
                    {event.toasts.map((toast) => (
                      <div key={toast.id} className="flex items-start gap-3">
                        <Avatar size="sm" className="mt-0.5 shrink-0">
                          <AvatarFallback className="text-[10px]">
                            {getInitials(
                              toast.author?.firstName,
                              toast.author?.lastName,
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-semibold text-foreground">
                              {toast.author?.firstName ?? "Guest"}{" "}
                              {toast.author?.lastName ?? ""}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              <span suppressHydrationWarning>{formatDate(toast.createdAt, "relative")}</span>
                            </span>
                          </div>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {toast.content}
                          </p>
                          {toast.amount != null && toast.amount > 0 && (
                            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-coral">
                              <Heart className="h-3 w-3" />
                              {formatCurrency(toast.amount)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── Guests ─────────────────── */}
            {activeTab === "guests" && (
              <>
                {!event.guests?.length ? (
                  <EmptyState
                    icon={Users}
                    title="No guests yet"
                    description="Invite guests to your event."
                  />
                ) : (
                  <div className="mx-auto max-w-2xl divide-y divide-line">
                    {event.guests.map((guest) => (
                      <div
                        key={guest.id}
                        className="flex items-center justify-between py-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar size="sm">
                            <AvatarFallback className="text-[10px]">
                              {getInitials(guest.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {guest.name}
                            </p>
                            {guest.email && (
                              <p className="text-xs text-muted-foreground truncate">
                                {guest.email}
                              </p>
                            )}
                            {guest.phone && (
                              <p className="text-xs text-muted-foreground">
                                {guest.phone}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {guest.category?.label && (
                            <span className="hidden rounded-full bg-muted px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:inline-block">
                              {guest.category.label}
                            </span>
                          )}
                          <span
                            className={cn(
                              "inline-block rounded-full px-3 py-0.5 text-[11px] font-bold",
                              RSVP_STYLES[guest.rsvpStatus]?.class ??
                                RSVP_STYLES.PENDING.class,
                            )}
                          >
                            {RSVP_STYLES[guest.rsvpStatus]?.label ??
                              guest.rsvpStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── Moments ────────────────── */}
            {activeTab === "moments" && (
              <>
                {!event.moments?.length ? (
                  <EmptyState
                    icon={Camera}
                    title="No moments yet"
                    description="Photos shared by guests will appear here."
                  />
                ) : (
                  <div className="columns-2 gap-3 sm:columns-3">
                    {event.moments.map((moment) => (
                      <button
                        key={moment.id}
                        className="group relative mb-3 block w-full overflow-hidden rounded-xl bg-muted"
                      >
                        <MediaEl
                          url={moment.imageUrl}
                          alt={moment.caption ?? "Moment"}
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                          {moment.caption && (
                            <p className="truncate text-sm text-white">
                              {moment.caption}
                            </p>
                          )}
                          <p className="text-xs text-white/70">
                            {moment.uploader?.firstName ?? "Someone"}{" "}
                            {moment.uploader?.lastName ?? ""}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── Tickets / Pass ─────────── */}
            {activeTab === "pass" && (
              <>
                {!event.ticketEvent?.tiers?.length ? (
                  <EmptyState
                    icon={Ticket}
                    title="No ticketing configured"
                    description="Ticket tiers haven't been set up for this event."
                  />
                ) : (
                  <div className="mx-auto max-w-xl space-y-8">
                    <div className="flex items-center justify-center gap-10 text-sm">
                      <div className="text-center">
                        <p className="text-3xl font-black font-display text-foreground">
                          {event.ticketEvent.totalSold}
                        </p>
                        <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                          Sold
                        </p>
                      </div>
                      <div className="h-10 w-px bg-line" />
                      <div className="text-center">
                        <p className="text-3xl font-black font-sans text-gold">
                          {formatCurrency(event.ticketEvent.revenue)}
                        </p>
                        <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                          Revenue
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {event.ticketEvent.tiers.map((tier) => {
                        const progress =
                          tier.capacity > 0
                            ? Math.round((tier.sold / tier.capacity) * 100)
                            : 0;
                        const remaining = Math.max(tier.capacity - tier.sold, 0);

                        return (
                          <Card key={tier.id} size="sm" className="px-5 py-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-sm font-semibold text-foreground">
                                  {tier.name}
                                </h4>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {tier.sold} / {tier.capacity} sold
                                </p>
                              </div>
                              <p className="text-lg font-black font-display text-foreground">
                                {tier.price === 0
                                  ? "Free"
                                  : formatCurrency(tier.price)}
                              </p>
                            </div>
                            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-turquoise transition-all"
                                style={{
                                  width: `${Math.min(progress, 100)}%`,
                                }}
                              />
                            </div>
                            <p className="mt-1 text-right text-[11px] text-muted-foreground">
                              {remaining} remaining
                            </p>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── Thread ─────────────────── */}
            {activeTab === "thread" && (
              <>
                {!event.thread ? (
                  <EmptyState
                    icon={Gift}
                    title="No thread configured"
                    description="A collaborative gifting thread hasn't been set up for this event."
                  />
                ) : (
                  <div className="mx-auto max-w-2xl space-y-6">
                    {event.thread.accessType && (
                      <p className="text-center text-xs text-muted-foreground">
                        Access: {event.thread.accessType.name}
                        {event.thread.allowedCircles?.length > 0 &&
                          ` · Circles: ${event.thread.allowedCircles.map((c) => c.name).join(", ")}`}
                      </p>
                    )}

                    {!event.thread.items?.length ? (
                      <EmptyState
                        icon={Gift}
                        title="No thread items"
                        description="No gift items have been added to this thread."
                      />
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {event.thread.items.map((item) => {
                          const isSoldOut =
                            item.status === ThreadItemStatus.SOLD_OUT;

                          return (
                            <Card
                              key={item.id}
                              size="sm"
                              className={cn(
                                "overflow-hidden",
                                isSoldOut && "opacity-50",
                              )}
                            >
                              {item.imageUrl && (
                                <div className="aspect-[4/3] overflow-hidden bg-muted">
                                  <MediaEl
                                    url={item.imageUrl}
                                    alt={item.name}
                                  />
                                </div>
                              )}
                              <div className="p-4">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="text-sm font-semibold text-foreground">
                                    {item.name}
                                  </h4>
                                  <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    {item.category}
                                  </span>
                                </div>
                                {item.description && (
                                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                                <div className="mt-3 flex items-center justify-between">
                                  <span className="text-sm font-black font-display text-foreground">
                                    {formatCurrency(item.price)}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {(item.participants?.length ?? 0) > 0
                                      ? `${item.participants!.length} contributor${item.participants!.length !== 1 ? "s" : ""}`
                                      : "Open"}
                                  </span>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ── Check-ins ──────────────── */}
            {activeTab === "check-ins" && (
              <>
                {!event.attendance?.length ? (
                  <EmptyState
                    icon={Users}
                    title="No check-ins recorded"
                    description="Checked-in guests will appear here once the event starts."
                  />
                ) : (
                  <div className="mx-auto max-w-xl">
                    <p className="mb-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {event.attendanceCount} checked in
                    </p>
                    <div className="divide-y divide-line">
                      {event.attendance.map((a) => {
                        const name = a.user
                          ? `${a.user.firstName} ${a.user.lastName}`
                          : a.guest?.name ?? "Unknown";

                        return (
                          <div
                            key={a.id}
                            className="flex items-center justify-between py-3"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar size="sm">
                                <AvatarFallback className="text-[10px]">
                                  {getInitials(
                                    a.user?.firstName,
                                    a.user?.lastName,
                                  ) ?? name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-semibold text-foreground">
                                {name}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              <span suppressHydrationWarning>{formatDate(a.checkedInAt, "relative")}</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

          </>
        )}

      </div>

      {/* ── Lightbox ────────────────────────────── */}
      {lightboxOpen && allMedia.length > 0 && (
        <Lightbox
          images={allMedia}
          initialIndex={lightboxIdx}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
