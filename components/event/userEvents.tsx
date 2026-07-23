"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatDate } from "@/lib/utils";
import {
  MoreHorizontal,
  Loader2,
  Globe,
  Lock,
  Calendar,
  MapPin,
  Pencil,
  Trash2,
} from "lucide-react";
import { getUserEventsApi, deleteEventApi } from "@/lib/api/events"; 
import { EventDetails } from "@/types/response";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/utils/helpers";
import { getFileUrl } from "@/lib/utils/getFileUrl";

export interface UserEvent {
  id: string;
  name: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  location?: string | null;
  coverImage?: string | null;
  slug: string;
  isPublic: boolean;
  status: string;
  hostId: string;
  host?: {
    id: string;
    firstName: string;
    lastName: string;
    photo?: string;
  };
  eventType?: {
    id: string;
    name?: string;
    icon?: React.ReactNode;
    label?: string;
  } | null;
}

const checkIsVideo = (url?: string | null) => {
  if (!url) return false;
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];
  return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

// Helper function to strip HTML tags and sanitize preview string
const stripHtmlAndTruncate = (htmlString?: string | null, maxLength = 120) => {
  if (!htmlString) return "";
  // Strip tags using DOMParser if in browser environment, fallback to regex
  let plainText = "";
  if (typeof window !== "undefined") {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    plainText = doc.body.textContent || "";
  } else {
    plainText = htmlString.replace(/<[^>]*>?/gm, "");
  }

  const trimmed = plainText.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength)}...`;
};

export const UserEvents: React.FC = () => {
  const router = useRouter();
  const [events, setEvents] = useState<EventDetails[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const observerTarget = useRef<HTMLDivElement | null>(null);
  const isInitialMount = useRef<boolean>(true);

  const fetchEvents = useCallback(async (targetPage: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getUserEventsApi({
        page: targetPage,
        limit: 12,
      });

      if (response.data) {
        const fetchedEvents = response.data.events || [];
        const pagination = response.data.pagination;

        setEvents((prev) =>
          targetPage === 1 ? fetchedEvents : [...prev, ...fetchedEvents],
        );
        setHasMore(pagination?.hasMore ?? false);
      } else {
        setHasMore(false);
      }
    } catch (err: unknown) {
      let errorMessage = "Failed to load events.";

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      const responseData = (
        err as { response?: { data?: { message?: string }; status?: number } }
      )?.response;
      if (responseData?.data?.message) {
        errorMessage = responseData.data.message;
      }

      if (errorMessage === "No event found" || responseData?.status === 404) {
        if (targetPage === 1) setEvents([]);
        setHasMore(false);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      void fetchEvents(1);
    }
  }, [fetchEvents]);

  // Infinite scroll trigger via Intersection Observer
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            void fetchEvents(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [hasMore, loading, fetchEvents]);

  const handleCardClick = (eventId: string) => {
    router.push(`/dashboard/events/${eventId}`);
  };

  const handleEditClick = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    router.push(`/dashboard/events/${eventId}/setup?step=logistics`);
  };

  const handleDeleteClick = async (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    try {
      setDeletingId(eventId);
      await deleteEventApi(eventId);
      setEvents((prev) => prev.filter((ev) => ev.id !== eventId));
    } catch (err) {
      console.error("Failed to delete event:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!loading && events.length === 0 && !error) {
    return (
      <div className="text-center py-12 text-neutral-500">No events found.</div>
    );
  }

  return (
    <div className="w-full">
      {/* Standard CSS Grid */}
      <section className="px-2 mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event, idx) => {
          const hostName = event.host
            ? `${event.host.firstName} ${event.host.lastName}`.trim()
            : null;

          const coverMedia = getFileUrl(event.coverImage);
          const isVideo = checkIsVideo(coverMedia);
          const cleanDescription = stripHtmlAndTruncate(event.description);

          return (
            <Card
              key={`${event.id}-${idx}`}
              onClick={() => handleCardClick(event.id)}
              className="py-0 cursor-pointer group overflow-hidden rounded-2xl border border-neutral-200 bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Fixed Aspect Media Banner */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-neutral-100">
                  {coverMedia ? (
                    isVideo ? (
                      <video
                        src={coverMedia}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={coverMedia}
                        alt={event.name || "Event cover image"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )
                  ) : null}

                  {/* Status & Privacy Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                    <span
                      className={cn(
                        "text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm",
                        event.status === "DRAFT"
                          ? "bg-amber-500/80 text-white"
                          : "bg-emerald-600 text-white",
                      )}
                    >
                      {event.status}
                    </span>

                    <span className="text-xs bg-black/40 backdrop-blur-md text-white p-1 rounded-full flex items-center justify-center">
                      {event.isPublic ? (
                        <Globe className="h-3 w-3" />
                      ) : (
                        <Lock className="h-3 w-3" />
                      )}
                    </span>
                  </div>

                  {event.eventType && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="text-xs font-medium bg-white/80 backdrop-blur-md text-neutral-900 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        
                        {event.eventType.label || event.eventType.name}
                      </span>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  {/* Event Title */}
                  <h3 className="text-base font-bold text-neutral-900 line-clamp-1 group-hover:text-coral transition-colors">
                    {event.name}
                  </h3>

                  {/* Date & Time */}
                  <div className="mt-2.5 flex items-center gap-2 text-xs text-neutral-600 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">
                      {formatDate(event.startDate) || "N/A"}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-neutral-500">
                    <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate">
                      {event.location || "Online / TBD"}
                    </span>
                  </div>

                  {/* Cleaned Plain Text Description */}
                  {cleanDescription && (
                    <p className="mt-2 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {cleanDescription}
                    </p>
                  )}
                </CardContent>
              </div>

              {/* Card Footer: Host & Actions */}
              <div className="px-4 pb-4 pt-2 border-t border-neutral-100 flex items-center justify-between mt-auto">
                {/* Host Info */}
                <div className="flex items-center gap-2 min-w-0">
                  {event.host?.photo ? (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={event.host.photo} alt={hostName || "Host"} />
                      <AvatarFallback>
                        {getInitials(
                          event.host?.firstName ?? "T",
                          event.host?.lastName ?? "R",
                        )}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-600 shrink-0">
                      {hostName?.charAt(0) || "H"}
                    </div>
                  )}
                  {hostName && (
                    <span className="text-xs font-medium text-neutral-700 truncate">
                      {hostName}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 transition"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      className="w-32 p-1 bg-white border border-neutral-200 rounded-lg shadow-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => handleEditClick(e, event.id)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-neutral-700 hover:bg-neutral-100 rounded-md transition"
                      >
                        <Pencil className="h-3.5 w-3.5 text-neutral-500" />
                        Edit
                      </button>
                      <button
                        disabled={deletingId === event.id}
                        onClick={(e) => handleDeleteClick(e, event.id)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-md transition disabled:opacity-50"
                      >
                        {deletingId === event.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5 text-red-600" />
                        )}
                        Delete
                      </button>
                    </PopoverContent>
                  </Popover>

                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8 px-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(event.id);
                    }}
                  >
                    View
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </section>

      {/* Error Banner */}
      {error && (
        <div className="text-center text-red-500 my-4 text-sm">{error}</div>
      )}

      {/* Infinite Scroll Trigger */}
      <div
        ref={observerTarget}
        className="py-6 flex justify-center items-center"
      >
        {loading && (
          <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
        )}
        {!hasMore && events.length > 0 && (
          <p className="text-xs text-neutral-400">
            You&apos;ve reached the end of the list.
          </p>
        )}
      </div>
    </div>
  );
};