"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MoreHorizontal,
  Loader2,
  Ticket,
  CalendarDays,
  User,
  MapPin,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { EventDetails } from "@/types/response";
import { getEventsApi } from "@/lib/api/events";
import { GetEventsOptions } from "@/types/payload";
import { getFileUrl } from "@/lib/utils/getFileUrl";
import Link from "next/link";

const CATEGORIES = [
  "All",
  "Today",
  "Festivals",
  "Weddings",
  "Vendors",
  "Concerts",
];

const checkIsVideo = (url?: string | null) => {
  if (!url) return false;
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];
  return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
};

export default function DiscoveryMasonry() {
  const router = useRouter();

  // Search & Filter States
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Pagination & Data States
  const [events, setEvents] = useState<EventDetails[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const observerTarget = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const isFetchingRef = useRef(false);
  const requestIdRef = useRef(0);
  const [scrolled, setScrolled] = useState(false);

  // Hide the category pills once the user scrolls the discovery feed.
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setScrolled(el.scrollTop > 40);
  }, []);

  // Debounce search input to prevent rapid API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchEvents = useCallback(
    async (
      targetPage: number,
      search: string,
      category: string,
      isNewSearch: boolean = false,
    ) => {
      if (isFetchingRef.current && !isNewSearch) return;

      const requestId = ++requestIdRef.current;
      isFetchingRef.current = true;
      setLoading(true);
      if (isNewSearch) {
        setError(null);
        setHasMore(true);
        setPage(0);
      }

      try {
        const queryParams: GetEventsOptions = {
          page: targetPage,
          limit: 12,
          isPublic: true, // Only show public events
        };

        const searchParts = [];
        if (search.trim()) searchParts.push(search.trim());
        if (category !== "All") searchParts.push(category);

        if (searchParts.length > 0) {
          queryParams.search = searchParts.join(" ");
        }

        const response = await getEventsApi(queryParams);
        if (requestId !== requestIdRef.current) return;

        if (response.data) {
          const fetchedEvents = response.data.events || [];
          const pagination = response.data.pagination;

          setEvents((prev) =>
            isNewSearch ? fetchedEvents : [...prev, ...fetchedEvents],
          );
          setHasMore(pagination?.hasMore ?? false);
          setPage(targetPage);
        } else {
          setHasMore(false);
          if (isNewSearch) setEvents([]);
        }
      } catch (err: unknown) {
        if (requestId !== requestIdRef.current) return;

        let errorMessage = "Failed to load events.";
        if (err instanceof Error) errorMessage = err.message;

        const responseData = (
          err as { response?: { data?: { message?: string }; status?: number } }
        )?.response;

        if (responseData?.data?.message) {
          errorMessage = responseData.data.message;
        }

        if (errorMessage === "No event found" || responseData?.status === 404) {
          if (isNewSearch) setEvents([]);
        } else {
          setError(errorMessage);
        }

        // Stop the observer from requesting the same failed page in a loop.
        setHasMore(false);
      } finally {
        if (requestId !== requestIdRef.current) return;

        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchEvents(1, debouncedQuery, activeCategory, true);
    }, 0);

    return () => clearTimeout(timer);
  }, [debouncedQuery, activeCategory, fetchEvents]);

  // Infinite scroll trigger via Intersection Observer
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
          void fetchEvents(page + 1, debouncedQuery, activeCategory, false);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [hasMore, page, debouncedQuery, activeCategory, fetchEvents]);

  const handleCardClick = (slug: string) => {
    router.push(`/events/${slug}`);
  };

  return (
    <div className="h-screen w-full  antialiased text-neutral-900 flex flex-col">
      {/* --- MAIN BROWSE VIEW CONTAINER --- */}
      <main
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 px-2 lg:px-8 pb-12 overflow-y-auto"
      >
        {/* --- TOP FIXED SEARCH BAR HEADER --- */}
        <div className="sticky top-0 z-20 px-2  pt-2 pb-2">
          <header className="flex flex-col lg:flex-row lg:items-center gap-4 py-5">
            <div className="relative flex flex-1 items-center">
              <Search className="absolute left-4 h-5 w-5 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, vendors or organizers..."
                className="w-full rounded-full bg-[#EBF0F3] py-3 pl-12 pr-4 text-[15px] font-normal outline-none transition focus:bg-[#E2E8F0] placeholder:text-neutral-500"
              />
            </div>
            {!scrolled && (
              <Link href="/dashboard/events/create">
                <Button variant="secondary">
                  Create event
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </header>

          {/* --- SUB-NAVIGATION CATEGORY PILLS --- */}
          <section
            className={cn(
              "mt-4 flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none transition-all duration-300",
              scrolled
                ? "max-h-0 mt-0 opacity-0 pointer-events-none pb-0"
                : "max-h-14 opacity-100",
            )}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition whitespace-nowrap",
                  activeCategory === cat
                    ? "bg-neutral-900 text-white"
                    : "bg-transparent text-neutral-800 hover:bg-neutral-100",
                )}
              >
                <span>{cat}</span>
                {cat === "Vendors" && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 font-medium leading-none pointer-events-none",
                      activeCategory === cat
                        ? "bg-neutral-800 text-neutral-200 border-neutral-700"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
                    )}
                  >
                    Coming Soon
                  </Badge>
                )}
              </button>
            ))}
          </section>
        </div>

        {/* --- MASONRY GRID SYSTEM --- */}
        {!loading && events.length === 0 && !error ? (
          <div className="text-center py-12 text-neutral-500">
            No events found matching your criteria.
          </div>
        ) : (
          <section className="px-2 mt-4 columns-2 gap-4 md:columns-3 lg:columns-4 space-y-4">
            {events.map((event, idx) => {
              const coverMedia = getFileUrl(event.coverImage);
              const isVideo = checkIsVideo(coverMedia);

              // Formatting Date safely
              let dateFormatted = "TBD";
              if (event.startDate) {
                try {
                  dateFormatted = new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                  }).format(new Date(event.startDate));
                } catch (e) {}
              }

              // Determine if event is Free vs Ticketed
              const isFree =
                !event.ticketEvent ||
                !event.ticketEvent.tiers ||
                event.ticketEvent.tiers.length === 0 ||
                event.ticketEvent.tiers.some(
                  (tier) => Number(tier.price) === 0,
                );

              return (
                <Card
                  key={`${event.id}-${idx}`}
                  className="px-2 py-3 break-inside-avoid mb-4 border border-neutral-100 hover:shadow-lg transition-all"
                >
                  <div
                    onClick={() => handleCardClick(event.slug)}
                    className="group relative overflow-hidden rounded-xl lg:rounded-2xl cursor-pointer"
                  >
                    {/* Media Container */}
                    <div
                      className={cn(
                        "relative w-full overflow-hidden rounded-xl lg:rounded-2xl bg-neutral-100",
                        !coverMedia &&
                          "min-h-[160px] flex items-center justify-center",
                      )}
                    >
                      {coverMedia ? (
                        isVideo ? (
                          <video
                            src={coverMedia}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <img
                            src={coverMedia}
                            alt={event.name || "Event image"}
                            className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        )
                      ) : null}

                      {/* Event Type Badge (Always visible on empty states, fades on hover for media) */}
                      {event.eventType && (
                        <div className="absolute top-3 left-3 z-10 transition-opacity duration-300 group-hover:opacity-0">
                          <span className="text-[10px] font-medium tracking-wide bg-white/70 backdrop-blur-md px-2 py-1 rounded-full shadow-sm text-neutral-800">
                            {event.eventType.label || event.eventType.name}
                          </span>
                        </div>
                      )}

                      {/* Hover Overlay Layer */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-4 z-20">
                        {/* Top: Free/Ticket Status & Restored View Button */}
                        <div className="flex items-start justify-between w-full">
                          {!event.isExternal && (
                            <span
                              className={cn(
                                "text-[9px] hidden lg:flex font-medium text-white tracking-wide backdrop-blur-md px-2 py-1.5 rounded-full flex items-center gap-1.5",
                                isFree
                                  ? "bg-green-500/80"
                                  : "bg-black/40 border border-white/20",
                              )}
                            >
                              <Ticket className="w-3.5 h-3.5" />
                              {isFree ? "Free Entry" : "Tickets"}
                            </span>
                          )}

                          <Button className="ml-auto px-2 "
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCardClick(event.slug);
                            }}
                          >
                            View Event
                          </Button>
                        </div>

                        {/* Bottom: Host Info & Restored More Menu */}
                        <div className="flex items-center justify-between text-white w-full">
                          {event.host ? (
                            <div className="text-white/90 text-xs flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 opacity-80" />
                              <span className="truncate font-medium">
                                By {event.host.firstName} {event.host.lastName}
                              </span>
                            </div>
                          ) : (
                            <span /> // Spacer if no host
                          )}

                          <button
                            onClick={(e) => e.stopPropagation()} // Prevent card click when interacting with menu
                            className="rounded-full bg-white p-2 text-neutral-900 hover:bg-neutral-100 transition"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Lower Context Label Elements */}
                    <div className="mt-2.5 lg:mt-3 px-1">
                      <h3 className="truncate text-sm md:text-base font-bold text-neutral-900 line-clamp-1 leading-tight group-hover:text-coral transition-colors">
                        {event.name}
                      </h3>

                      <div className="flex items-center text-xs text-neutral-500 mt-1 gap-2 truncate">
                        <span className="flex items-center gap-1.5 shrink-0 font-medium text-neutral-600">
                          <CalendarDays className="w-3.5 h-3.5 opacity-70" />
                          {dateFormatted}
                        </span>

                        {event.location && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-neutral-300 shrink-0" />
                            <span className="truncate flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 opacity-70 shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </section>
        )}

        {/* Error Banner */}
        {error && (
          <div className="my-4 flex flex-col items-center gap-2 text-center text-sm text-red-500">
            <p>{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                void fetchEvents(1, debouncedQuery, activeCategory, true)
              }
              disabled={loading}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Infinite Scroll Loader */}
        <div
          ref={observerTarget}
          className="py-8 flex justify-center items-center"
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
      </main>
    </div>
  );
}
