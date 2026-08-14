"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  MoreVertical,
  CalendarDays,
  MapPin,
  Trash2,
  Edit,
  Sparkles,
} from "lucide-react";
import { getUserEventsApi, deleteEventApi } from "@/lib/api/events"; 
import { EventDetails } from "@/types/response";
import { getFileUrl } from "@/lib/utils/getFileUrl";
import { Button } from "../ui/button";

export interface UserEvent {
  id: string;
  name: string;
  startDate: string;
  location?: string;
  coverImage?: string;
  hostName?: string;
  status?: string;
}

const checkIsVideo = (url?: string | null) => {
  if (!url) return false;
  const exts = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];
  return exts.some((ext) => url.toLowerCase().includes(ext));
};

const stripHtmlAndTruncate = (htmlString?: string | null, maxLength = 120) => {
  if (!htmlString) return "";
  const plainText = htmlString
    .replace(/<[^>]*>?/gm, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");

  const trimmed = plainText.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength)}...`;
};

export const UserEvents: React.FC = () => {
  const router = useRouter();
  const [events, setEvents] = useState<EventDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);

  // Sentinel ref for infinite scrolling
  const observerTarget = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  const fetchEvents = useCallback(async (pageToFetch: number) => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setError(null);

    try {
      if (pageToFetch === 1) setLoading(true);
      else setIsFetchingMore(true);

      const res = await getUserEventsApi({ page: pageToFetch, limit: 12 });

      if (res.data) {
        const data = res.data;
        setEvents((prev) =>
          pageToFetch === 1 ? data.events : [...prev, ...data.events]
        );
        if (data.pagination) setTotalPages(data.pagination.totalPages);
        setPage(pageToFetch);
      } else {
        setError("No event data was returned.");
        setTotalPages((currentTotalPages) =>
          Math.min(currentTotalPages, pageToFetch - 1)
        );
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load events.");
      // A visible sentinel would immediately retry a failed page otherwise.
      setTotalPages((currentTotalPages) =>
        Math.min(currentTotalPages, pageToFetch - 1)
      );
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setIsFetchingMore(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void fetchEvents(1), 0);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  // Observer for Infinite Scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          page < totalPages &&
          !isFetchingRef.current
        ) {
          void fetchEvents(page + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [page, totalPages, fetchEvents]);

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEventApi(eventId);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete event.");
    }
  };

  const handleCardClick = (eventId: string) => {
    router.push(`/dashboard/events/${eventId}`);
  };

  if (loading && page === 1) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-neutral-400">
          <div className="h-6 w-6 border-2 border-turquoise border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading your events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-16">
        <p className="text-sm text-red-500 font-medium mb-3">{error}</p>
        <button
          onClick={() => fetchEvents(1)}
          className="text-xs bg-neutral-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-neutral-800 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="w-full text-center py-20 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
        <Sparkles className="h-8 w-8 text-turquoise mx-auto mb-3" />
        <h3 className="text-base font-bold text-neutral-900 mb-1">
          No events created yet
        </h3>
        <p className="text-xs text-neutral-500 max-w-xs mx-auto mb-6">
          Get started by creating your first celebration or gathering thread.
        </p>
        <Button
          onClick={() => router.push("/dashboard/create")}
          variant="secondary"
          size="sm"
        >
          Create Event
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Standard CSS Grid */}
      <section className="px-2 mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event, idx) => {
          const coverMedia = getFileUrl(event.coverImage);
          const isVideo = checkIsVideo(coverMedia);
          const cleanDescription = stripHtmlAndTruncate(event.description);

          return (
            <Card
              key={event.id || idx}
              onClick={() => handleCardClick(event.id)}
              className="group py-0 relative cursor-pointer border border-neutral-200/80 bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Media Section */}
                <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                  {coverMedia ? (
                    isVideo ? (
                      <video
                        src={coverMedia}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        src={coverMedia}
                        alt={event.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-400">
                      <Sparkles className="h-6 w-6 mb-1 text-turquoise opacity-70" />
                      <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                        {event.eventType?.label || "Event"}
                      </span>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="bg-neutral-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {event.eventType?.label || "General"}
                    </span>
                    {event.status && (
                      <span className="bg-white/90 backdrop-blur-md text-neutral-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        {event.status}
                      </span>
                    )}
                  </div>
                </div>

                <CardContent className="p-4 pb-0">
                  {/* Event Title */}
                  <h3 className="text-base font-bold text-neutral-900 line-clamp-1 group-hover:text-coral transition-colors">
                    {event.name}
                  </h3>

                  {/* Metadata */}
                  <div className="mt-2.5 space-y-1.5 text-xs text-neutral-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-turquoise shrink-0" />
                      <span className="truncate">
                        {event.startDate
                          ? new Date(event.startDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "TBD"}
                      </span>
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-turquoise shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Description preview */}
                  {cleanDescription && (
                    <p className="mt-3 text-xs text-neutral-600 line-clamp-2 leading-relaxed border-t border-neutral-100 pt-2.5">
                      {cleanDescription}
                    </p>
                  )}
                </CardContent>
              </div>

              {/* Card Footer: Actions */}
              <div className="px-4 pb-4 border-neutral-100 flex items-center justify-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="h-8 w-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-36 p-1 bg-white rounded-xl shadow-lg border border-neutral-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        router.push(`/dashboard/events/${event.id}/edit`)
                      }
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      Edit Event
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </PopoverContent>
                </Popover>
              </div>
            </Card>
          );
        })}
      </section>

      {/* Sentinel Element for Infinite Scroll */}
      <div ref={observerTarget} className="h-10 w-full flex items-center justify-center mt-6">
        {isFetchingMore && (
          <div className="flex items-center gap-2 text-neutral-400 text-xs font-medium">
            <div className="h-4 w-4 border-2 border-turquoise border-t-transparent rounded-full animate-spin" />
            Loading more events...
          </div>
        )}
      </div>
    </div>
  );
};
