"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { format } from "date-fns";

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

const checkIsEventToday = (event: EventDetails): boolean => {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0,
  ).getTime();
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  ).getTime();

  const startTime = event.startDate ? new Date(event.startDate).getTime() : NaN;
  const endTime = event.endDate ? new Date(event.endDate).getTime() : NaN;

  // If both dates exist, check if event spans or intersects today
  if (!isNaN(startTime) && !isNaN(endTime)) {
    return startTime <= endOfToday && endTime >= startOfToday;
  }

  // If only startDate exists
  if (!isNaN(startTime)) {
    return startTime >= startOfToday && startTime <= endOfToday;
  }

  // If only endDate exists
  if (!isNaN(endTime)) {
    return endTime >= startOfToday && endTime <= endOfToday;
  }

  return false;
};

const checkIsEventEnded = (event: EventDetails): boolean => {
  // Do not mark events happening today as ended
  if (checkIsEventToday(event)) {
    return false;
  }

  const now = Date.now();
  const startTime = event.startDate ? new Date(event.startDate).getTime() : NaN;
  const endTime = event.endDate ? new Date(event.endDate).getTime() : NaN;

  // If start date is in the future, event has not ended
  if (!isNaN(startTime) && startTime > now) {
    return false;
  }

  // If end date exists and is valid, event has ended if end date has passed
  if (!isNaN(endTime)) {
    return endTime < now;
  }

  // If no end date, event has ended if start date has passed
  if (!isNaN(startTime)) {
    return startTime < now;
  }

  return false;
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

  // Sort events so all future events come before all past events
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const aEnded = checkIsEventEnded(a);
      const bEnded = checkIsEventEnded(b);

      // Future events must come before all past events
      if (!aEnded && bEnded) return -1;
      if (aEnded && !bEnded) return 1;

      // Both are future/ongoing: sort chronologically by startDate (earliest first)
      if (!aEnded && !bEnded) {
        const aStart = a.startDate ? new Date(a.startDate).getTime() : Infinity;
        const bStart = b.startDate ? new Date(b.startDate).getTime() : Infinity;
        return aStart - bStart;
      }

      // Both are past/ended: sort by most recently ended/started first (descending)
      const aTime = a.endDate
        ? new Date(a.endDate).getTime()
        : a.startDate
          ? new Date(a.startDate).getTime()
          : 0;
      const bTime = b.endDate
        ? new Date(b.endDate).getTime()
        : b.startDate
          ? new Date(b.startDate).getTime()
          : 0;
      return bTime - aTime;
    });
  }, [events]);

  // Responsive column count: 4 on desktop (lg), 3 on tablet (md), 2 on mobile
  const [columnCount, setColumnCount] = useState<number>(4);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setColumnCount(4);
      } else if (width >= 768) {
        setColumnCount(3);
      } else {
        setColumnCount(2);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Distribute events row-wise across columns so left -> right -> next row reading order is preserved
  const columnEvents = useMemo(() => {
    const cols: EventDetails[][] = Array.from({ length: columnCount }, () => []);
    sortedEvents.forEach((event, index) => {
      cols[index % columnCount].push(event);
    });
    return cols;
  }, [sortedEvents, columnCount]);

  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const observerTarget = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const isFetchingRef = useRef(false);
  const requestIdRef = useRef(0);

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
          isPublic: true,
        };

        if (category === "Today") {
          queryParams.date = format(new Date(), "yyyy-MM-dd");
        }

        const searchParts = [];
        if (search.trim()) searchParts.push(search.trim());
        if (category !== "All" && category !== "Today") searchParts.push(category);

        if (searchParts.length > 0) {
          queryParams.search = searchParts.join(" ");
        }

        const response = await getEventsApi(queryParams);
        if (requestId !== requestIdRef.current) return;

        if (response.data) {
          const fetchedEvents = response.data.events || [];
          const pagination = response.data.pagination;

          setEvents((prev) => {
            if (isNewSearch) return fetchedEvents;
            // Prevent duplicated items using a unique Map check by ID
            const combined = [...prev, ...fetchedEvents];
            const uniqueMap = new Map();
            combined.forEach((item) => uniqueMap.set(item.id, item));
            return Array.from(uniqueMap.values());
          });

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
        // Prevent observer from triggering page 2 before initial page 1 is loaded
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isFetchingRef.current &&
          !loading &&
          page > 0
        ) {
          void fetchEvents(page + 1, debouncedQuery, activeCategory, false);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [hasMore, page, loading, debouncedQuery, activeCategory, fetchEvents]);

  const handleCardClick = (slug: string) => {
    router.push(`/events/${slug}`);
  };

  return (
    <div className="h-screen w-full antialiased text-neutral-900 flex flex-col">
      <main
        ref={scrollContainerRef}
        className="flex-1 px-2 lg:px-8 pb-12 overflow-y-auto"
      >
        <div className="sticky top-0 z-50 px-2 pt-2 bg-white/85 backdrop-blur-md border-b border-neutral-100/80 transition-colors">
          <header className="flex flex-col lg:flex-row lg:items-center gap-4 py-3">
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

            <div className="hidden lg:flex items-center shrink-0">
              <Link href="/dashboard/events/create">
                <Button variant="secondary" className="whitespace-nowrap">
                  Create event
                  <Plus className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </header>

          <div className="overflow-hidden">
            <section className="min-h-0 overflow-hidden">
              <div className="flex items-center gap-3 overflow-x-auto pt-2 pb-3 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition whitespace-nowrap",
                      activeCategory === cat
                        ? "bg-neutral-900 text-white"
                        : "bg-transparent text-neutral-800 hover:bg-neutral-100"
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
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                        )}
                      >
                        Coming Soon
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>

        {!loading && sortedEvents.length === 0 && !error ? (
          <div className="text-center py-12 text-neutral-500">
            No events found matching your criteria.
          </div>
        ) : (
          <section className="px-2 mt-4 flex gap-4 items-start">
            {columnEvents.map((colEvents, colIdx) => (
              <div key={colIdx} className="flex-1 flex flex-col gap-4 min-w-0">
                {colEvents.map((event) => {
                  const coverMedia = getFileUrl(event.coverImage);
                  const isVideo = checkIsVideo(coverMedia);
                  const isToday = checkIsEventToday(event);
                  const isEnded = checkIsEventEnded(event);

                  let dateFormatted = "TBD";
                  if (event.startDate) {
                    try {
                      dateFormatted = new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                      }).format(new Date(event.startDate));
                    } catch (e) {}
                  }

                  const isFree =
                    !event.ticketEvent ||
                    !event.ticketEvent.tiers ||
                    event.ticketEvent.tiers.length === 0 ||
                    event.ticketEvent.tiers.some(
                      (tier) => Number(tier.price) === 0,
                    );

                  return (
                    <Card
                      key={event.id}
                      className="w-full px-2 py-3 border border-neutral-100 hover:shadow-lg transition-all"
                    >
                      <div
                        onClick={() => handleCardClick(event.slug)}
                        className="group relative overflow-hidden rounded-xl lg:rounded-2xl cursor-pointer"
                      >
                        <div
                          className={cn(
                            "relative w-full overflow-hidden rounded-xl lg:rounded-2xl bg-neutral-100 min-h-[160px]",
                            !coverMedia && "flex items-center justify-center",
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
                                className={cn(
                                  "w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]",
                                  isEnded && "opacity-60 grayscale-[35%]",
                                )}
                              />
                            ) : (
                              <img
                                src={coverMedia}
                                alt={event.name || "Event image"}
                                className={cn(
                                  "w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]",
                                  isEnded && "opacity-60 grayscale-[35%]",
                                )}
                              />
                            )
                          ) : null}

                          {event.eventType && (
                            <div className="absolute top-3 left-3 z-10 transition-opacity duration-300 group-hover:opacity-0">
                              <span className="text-[10px] font-medium tracking-wide bg-white/70 backdrop-blur-md px-2 py-1 rounded-full shadow-sm text-neutral-800">
                                {event.eventType.label || event.eventType.name}
                              </span>
                            </div>
                          )}

                          {isToday ? (
                            <div className="absolute top-3 right-3 z-10 transition-opacity duration-300 group-hover:opacity-0">
                              <Badge className="bg-green-600 text-white backdrop-blur-md text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 shadow-sm hover:bg-green-600">
                                Today
                              </Badge>
                            </div>
                          ) : isEnded ? (
                            <div className="absolute top-3 right-3 z-10 transition-opacity duration-300 group-hover:opacity-0">
                              <Badge
                                variant="secondary"
                                className="bg-neutral-900/80 text-white backdrop-blur-md text-[10px] font-semibold px-2 py-0.5 rounded-full border border-neutral-700/50 shadow-sm"
                              >
                                Ended
                              </Badge>
                            </div>
                          ) : null}

                          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-4 z-20">
                            <div className="flex items-start justify-between w-full">
                              {isToday ? (
                                <Badge className="text-[9px] font-semibold text-white tracking-wide bg-green-600 border border-green-400/30 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1.5 hover:bg-green-600">
                                  Today
                                </Badge>
                              ) : isEnded ? (
                                <Badge
                                  variant="secondary"
                                  className="text-[9px] font-semibold text-white tracking-wide bg-neutral-900/80 border border-white/20 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1.5"
                                >
                                  Ended
                                </Badge>
                              ) : !event.isExternal ? (
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
                              ) : null}

                              <Button
                                className="ml-auto px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCardClick(event.slug);
                                }}
                              >
                                View Event
                              </Button>
                            </div>

                            <div className="flex items-center justify-between text-white w-full">
                              {event.host ? (
                                <div className="text-white/90 text-xs flex items-center gap-1.5">
                                  <User className="w-3.5 h-3.5 opacity-80" />
                                  <span className="truncate font-medium">
                                    By {event.host.firstName} {event.host.lastName}
                                  </span>
                                </div>
                              ) : (
                                <span />
                              )}
                            </div>
                          </div>
                        </div>

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
              </div>
            ))}
          </section>
        )}

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

        <div
          ref={observerTarget}
          className="py-8 flex justify-center items-center"
        >
          {loading && (
            <Loader2 className="h-6 w-6 animate-spin text-neutral-500" />
          )}
          {!hasMore && sortedEvents.length > 0 && (
            <p className="text-xs text-neutral-400">
              You&apos;ve reached the end of the list.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}