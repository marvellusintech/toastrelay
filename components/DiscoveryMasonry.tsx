"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Loader2,
  Ticket,
  CalendarDays,
  User,
  MapPin,
  Plus,
  Navigation,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { EventDetails } from "@/types/response";
import { getEventsApi } from "@/lib/api/events";
import { GetEventsOptions } from "@/types/payload";
import { getFileUrl } from "@/lib/utils/getFileUrl";
import Link from "next/link";
import { format, addDays } from "date-fns";
import { LocationBanner } from "@/components/reuseables/location-banner";
import { useLocationStore } from "@/lib/store/useLocationStore";
import {
  getEventDistance,
  formatDistance,
  reverseGeocode,
} from "@/lib/utils/location";

const CATEGORIES = [
  "All",
  "Today",
  "This weekend",
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

const getThisWeekendRange = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday

  let diffToFriday = 0;
  let diffToSunday = 0;

  if (day === 0) {
    // Sunday: current weekend started Friday (-2 days) and ends today (0 days)
    diffToFriday = -2;
    diffToSunday = 0;
  } else if (day === 6) {
    // Saturday: current weekend started Friday (-1 day) and ends tomorrow (+1 day)
    diffToFriday = -1;
    diffToSunday = 1;
  } else if (day === 5) {
    // Friday: current weekend starts today (0 days) and ends Sunday (+2 days)
    diffToFriday = 0;
    diffToSunday = 2;
  } else {
    // Monday (1) to Thursday (4): upcoming weekend
    diffToFriday = 5 - day;
    diffToSunday = 7 - day;
  }

  const friday = addDays(now, diffToFriday);
  const sunday = addDays(now, diffToSunday);

  const startOfWeekend = new Date(
    friday.getFullYear(),
    friday.getMonth(),
    friday.getDate(),
    0,
    0,
    0,
    0,
  ).getTime();

  const endOfWeekend = new Date(
    sunday.getFullYear(),
    sunday.getMonth(),
    sunday.getDate(),
    23,
    59,
    59,
    999,
  ).getTime();

  return { startOfWeekend, endOfWeekend };
};

const getThisWeekendDates = (): string[] => {
  const now = new Date();
  const day = now.getDay();

  let diffToFriday = 0;
  if (day === 0) diffToFriday = -2;
  else if (day === 6) diffToFriday = -1;
  else if (day === 5) diffToFriday = 0;
  else diffToFriday = 5 - day;

  const friday = addDays(now, diffToFriday);
  const saturday = addDays(friday, 1);
  const sunday = addDays(friday, 2);

  return [friday, saturday, sunday].map((d) => format(d, "yyyy-MM-dd"));
};

const checkIsEventThisWeekend = (event: EventDetails): boolean => {
  const { startOfWeekend, endOfWeekend } = getThisWeekendRange();

  const startTime = event.startDate ? new Date(event.startDate).getTime() : NaN;
  const endTime = event.endDate ? new Date(event.endDate).getTime() : NaN;

  // If both dates exist, check if event spans or intersects this weekend
  if (!isNaN(startTime) && !isNaN(endTime)) {
    return startTime <= endOfWeekend && endTime >= startOfWeekend;
  }

  // If only startDate exists
  if (!isNaN(startTime)) {
    return startTime >= startOfWeekend && startTime <= endOfWeekend;
  }

  // If only endDate exists
  if (!isNaN(endTime)) {
    return endTime >= startOfWeekend && endTime <= endOfWeekend;
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

  // Location & Proximity Sorting State (persisted across refreshes)
  const {
    userLocation,
    isLocationSortActive,
    isBannerDismissed,
    setUserLocation,
    setIsBannerDismissed,
    resetLocation,
  } = useLocationStore();

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleUseLocation = useCallback(() => {
    // Immediately dismiss the banner so it leaves the screen
    setIsBannerDismissed(true);

    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    const toastId = toast.loading("Finding events near you...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const coords = await reverseGeocode(lat, lon);
          setUserLocation(coords);
          toast.success(
            `Showing events near ${coords.city || coords.formattedAddress || "your location"}`,
            { id: toastId },
          );
        } catch {
          setUserLocation({ latitude: lat, longitude: lon });
          toast.success("Showing events near your location", { id: toastId });
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === 1) {
          toast.error(
            "Location access was denied. Please allow access in browser settings.",
            { id: toastId },
          );
        } else if (err.code === 2) {
          toast.error("Position unavailable. Please try again.", { id: toastId });
        } else if (err.code === 3) {
          toast.error("Location request timed out. Please try again.", { id: toastId });
        } else {
          toast.error("Unable to retrieve your location.", { id: toastId });
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  }, [setIsBannerDismissed, setUserLocation]);

  const handleResetLocation = useCallback(() => {
    resetLocation();
    setLocationError(null);
  }, [resetLocation]);

  // Sort events: proximity sort when location is active, chronological otherwise
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const aEnded = checkIsEventEnded(a);
      const bEnded = checkIsEventEnded(b);

      // Future events must come before all past events
      if (!aEnded && bEnded) return -1;
      if (aEnded && !bEnded) return 1;

      // When location sorting is active, sort future events by proximity to user
      if (isLocationSortActive && userLocation && !aEnded && !bEnded) {
        const distA = getEventDistance(a.location, userLocation);
        const distB = getEventDistance(b.location, userLocation);

        if (Math.abs(distA - distB) > 0.5) {
          return distA - distB;
        }
      }

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
  }, [events, isLocationSortActive, userLocation]);

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
        if (
          category !== "All" &&
          category !== "Today" &&
          category !== "This weekend"
        ) {
          searchParts.push(category);
        }

        if (searchParts.length > 0) {
          queryParams.search = searchParts.join(" ");
        }

        let fetchedEvents: EventDetails[] = [];
        let hasMorePages = false;

        if (category === "This weekend") {
          const weekendDates = getThisWeekendDates();
          const results = await Promise.allSettled(
            weekendDates.map((d) =>
              getEventsApi({
                ...queryParams,
                date: d,
              }),
            ),
          );

          if (requestId !== requestIdRef.current) return;

          let anySuccess = false;
          let notFoundOrEmptyCount = 0;

          for (const res of results) {
            if (res.status === "fulfilled") {
              anySuccess = true;
              if (res.value.data?.events) {
                fetchedEvents.push(...res.value.data.events);
              }
              if (res.value.data?.pagination?.hasMore) {
                hasMorePages = true;
              }
            } else {
              const err = res.reason;
              const responseData = (
                err as {
                  response?: { data?: { message?: string }; status?: number };
                }
              )?.response;
              const msg =
                responseData?.data?.message ||
                (err instanceof Error ? err.message : "");
              if (msg === "No event found" || responseData?.status === 404) {
                notFoundOrEmptyCount++;
              }
            }
          }

          if (!anySuccess && notFoundOrEmptyCount !== results.length) {
            const firstFailure = results.find((r) => r.status === "rejected") as
              | PromiseRejectedResult
              | undefined;
            if (firstFailure) throw firstFailure.reason;
          }

          fetchedEvents = fetchedEvents.filter(checkIsEventThisWeekend);
        } else {
          const response = await getEventsApi(queryParams);
          if (requestId !== requestIdRef.current) return;

          if (response.data) {
            fetchedEvents = response.data.events || [];
            hasMorePages = response.data.pagination?.hasMore ?? false;
          } else {
            hasMorePages = false;
          }
        }

        setEvents((prev) => {
          if (isNewSearch) return fetchedEvents;
          // Prevent duplicated items using a unique Map check by ID
          const combined = [...prev, ...fetchedEvents];
          const uniqueMap = new Map();
          combined.forEach((item) => uniqueMap.set(item.id, item));
          return Array.from(uniqueMap.values());
        });

        setHasMore(hasMorePages);
        setPage(targetPage);
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

                {isLocationSortActive && (
                  <div className="inline-flex items-center gap-1.5 rounded-full pl-3 pr-2 py-1 text-xs font-semibold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 transition whitespace-nowrap">
                    <Navigation className="w-3 h-3 text-teal-600 animate-pulse" />
                    <span>Near {userLocation?.city || "You"}</span>
                    <button
                      type="button"
                      onClick={handleResetLocation}
                      title="Clear location filter"
                      className="p-0.5 rounded-full hover:bg-teal-200/60 dark:hover:bg-teal-800/60 text-teal-600 dark:text-teal-300 transition cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Location Banner */}
        {!isBannerDismissed && !isLocationSortActive && (
          <div className="px-2 pt-2 pb-1">
            <LocationBanner
              onUseLocation={handleUseLocation}
              onResetLocation={handleResetLocation}
              isLocating={isLocating}
              isActive={isLocationSortActive}
              userAddress={userLocation?.formattedAddress || userLocation?.city}
              error={locationError}
              onDismiss={() => setIsBannerDismissed(true)}
            />
          </div>
        )}

        {!loading && sortedEvents.length === 0 && !error ? (
          <div className="text-center py-12 text-neutral-500">
            No events found matching your criteria.
          </div>
        ) : (
          <section className="px-2 mt-2 flex gap-4 items-start">
            {columnEvents.map((colEvents, colIdx) => (
              <div key={colIdx} className="flex-1 flex flex-col gap-4 min-w-0">
                {colEvents.map((event) => {
                  const coverMedia = getFileUrl(event.coverImage);
                  const isVideo = checkIsVideo(coverMedia);
                  const isToday = checkIsEventToday(event);
                  const isThisWeekend = checkIsEventThisWeekend(event);
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
                            <div className="absolute top-2 lg:top-3 left-2 lg:left-3 z-10 transition-opacity duration-300 group-hover:opacity-0">
                              <span className="text-[10px] font-medium tracking-wide bg-white/70 backdrop-blur-md px-2 py-1 rounded-full shadow-sm text-neutral-800">
                                {event.eventType.label || event.eventType.name}
                              </span>
                            </div>
                          )}

                          {isToday ? (
                            <div className="absolute right-2 lg:right-3 top-2 lg:top-3  z-10 transition-opacity duration-300 group-hover:opacity-0">
                              <Badge className="bg-green-600 text-white backdrop-blur-md text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 shadow-sm hover:bg-green-600">
                                Today
                              </Badge>
                            </div>
                          ) : isThisWeekend && !isEnded ? (
                            <div className="absolute top-2 lg:top-3 right-2 lg:right-3 z-10 transition-opacity duration-300 group-hover:opacity-0">
                              <Badge className="bg-indigo-600 text-white backdrop-blur-md text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 shadow-sm hover:bg-indigo-600">
                                This weekend
                              </Badge>
                            </div>
                          ) : isEnded ? (
                            <div className="absolute top-2 lg:top-3 right-2 lg:right-3 z-10 transition-opacity duration-300 group-hover:opacity-0">
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
                              ) : isThisWeekend && !isEnded ? (
                                <Badge className="text-[9px] font-semibold text-white tracking-wide bg-indigo-600 border border-indigo-400/30 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1.5 hover:bg-indigo-600">
                                  This weekend
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

                            {isLocationSortActive &&
                              userLocation &&
                              event.location &&
                              (() => {
                                const dist = getEventDistance(
                                  event.location,
                                  userLocation,
                                );
                                const distLabel = formatDistance(dist);
                                if (!distLabel) return null;
                                return (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-neutral-300 shrink-0" />
                                    <span className="shrink-0 font-medium text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-1.5 py-0.5 rounded text-[10px]">
                                      {distLabel}
                                    </span>
                                  </>
                                );
                              })()}
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