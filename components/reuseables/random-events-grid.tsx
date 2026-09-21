"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  CalendarDays,
  MapPin,
  Shuffle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEventsApi } from "@/lib/api/events";
import { getFileUrl } from "@/lib/utils/getFileUrl";
import { formatDate } from "@/lib/utils/dateFormatter";
import { EventDetails } from "@/types/response";
import { cn } from "@/lib/utils";

export interface DisplayEvent {
  id: string;
  slug: string;
  name: string;
  category?: string;
  date?: string;
  location?: string;
  coverMedia: string;
  isVideo: boolean;
}

const DEFAULT_POSTER =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop";
const DEFAULT_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";

const DISPLAY_COUNT = 6;

function checkIsVideo(url?: string | null): boolean {
  if (!url) return false;
  let decoded = url;
  try {
    decoded = decodeURIComponent(url);
  } catch {
    // ignore
  }
  const lower = decoded.toLowerCase();
  const videoExtensions = [
    ".mp4",
    ".webm",
    ".ogg",
    ".mov",
    ".m4v",
    ".mkv",
    ".avi",
    "video/",
  ];
  return videoExtensions.some((ext) => lower.includes(ext));
}

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function mapApiEvent(event: EventDetails): DisplayEvent {
  const rawCover = event.coverImage ? getFileUrl(event.coverImage) : null;
  const coverMedia = rawCover || DEFAULT_POSTER;
  const isVideo = checkIsVideo(event.coverImage) || checkIsVideo(coverMedia);

  let formattedDate: string | undefined = undefined;
  if (event.startDate) {
    try {
      formattedDate = formatDate(event.startDate, "display");
    } catch {
      formattedDate = String(event.startDate);
    }
  }

  return {
    id: event.id,
    slug: event.slug || event.id,
    name: event.name || "Untitled Event",
    category: event.eventType?.label || event.eventType?.name || undefined,
    date: formattedDate,
    location: event.location || undefined,
    coverMedia,
    isVideo,
  };
}

function checkIsEventPast(event: EventDetails): boolean {
  if (
    event.status?.toUpperCase() === "COMPLETED" ||
    event.status?.toUpperCase() === "CANCELLED"
  ) {
    return true;
  }

  const now = Date.now();
  const startTime = event.startDate ? new Date(event.startDate).getTime() : NaN;
  const endTime = event.endDate ? new Date(event.endDate).getTime() : NaN;

  // If end date exists and is valid, event has ended if end date has passed
  if (!isNaN(endTime)) {
    return endTime < now;
  }

  // If only start date exists
  if (!isNaN(startTime)) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // If event is today, it is active (not past)
    if (startTime >= startOfToday.getTime() && startTime <= endOfToday.getTime()) {
      return false;
    }

    return startTime < startOfToday.getTime();
  }

  return false;
}

export function RandomEventsGrid() {
  const router = useRouter();
  const [allEvents, setAllEvents] = useState<DisplayEvent[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<DisplayEvent[]>([]);
  const [, startTransition] = useTransition();
  const [isRotating, setIsRotating] = useState(false);

  const pickRandom = (pool: DisplayEvent[]) => {
    if (!pool || pool.length === 0) return;
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);

    startTransition(() => {
      const shuffled = shuffleArray(pool);
      setDisplayedEvents(shuffled.slice(0, DISPLAY_COUNT));
    });
  };

  useEffect(() => {
    let isMounted = true;

    getEventsApi({ isPublic: true, limit: 50 })
      .then((res) => {
        if (!isMounted) return;
        const events = res?.data?.events;
        if (Array.isArray(events) && events.length > 0) {
          const activeEvents = events.filter((e) => !checkIsEventPast(e));
          if (activeEvents.length > 0) {
            const mapped = activeEvents.map(mapApiEvent);
            setAllEvents(mapped);
            const shuffled = shuffleArray(mapped);
            setDisplayedEvents(shuffled.slice(0, DISPLAY_COUNT));
          }
        }
      })
      .catch(() => {
        // Fallback: displayedEvents remains empty, default media is displayed
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCardClick = (event: DisplayEvent) => {
    router.push(`/events/${event.slug || event.id}`);
  };

  // If there are no events returned, show the default media that was initially there
  if (displayedEvents.length === 0) {
    return (
      <video
        src={DEFAULT_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        poster={DEFAULT_POSTER}
        className="mx-auto rounded-2xl object-cover h-full w-full object-left-top"
      />
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-zinc-950 rounded-xl overflow-hidden shadow-inner select-none p-3 sm:p-4">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-1 border-b border-black/5 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-turquoise-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-turquoise-600" />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-800 dark:text-neutral-200 font-display">
            You Might Like
          </span>
          {/* <span className="hidden sm:inline-block text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
            • Picked at Random
          </span> */}
        </div>

        <div className="flex items-center gap-2">
          {allEvents.length > DISPLAY_COUNT && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => pickRandom(allEvents)}
              className="h-7 sm:h-8 px-2.5 sm:px-3 text-xs font-medium gap-1.5 rounded-full border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <Shuffle
                className={cn(
                  "w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300 transition-transform duration-500",
                  isRotating && "rotate-180"
                )}
              />
              <span className="hidden xs:inline">Shuffle</span>
            </Button>
          )}

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => router.push("/discovery")}
            className="h-7 sm:h-8 px-2.5 sm:px-3 text-xs font-medium gap-1 rounded-full cursor-pointer"
          >
            <span>Explore all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4 overflow-y-auto pr-1 scrollbar-none py-1">
        <AnimatePresence mode="popLayout">
          {displayedEvents.map((event, index) => (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              onClick={() => handleCardClick(event)}
              className="group relative flex flex-col justify-between rounded-xl overflow-hidden bg-neutral-50/80 dark:bg-zinc-900/80 border border-neutral-200/70 dark:border-neutral-800/80 hover:border-turquoise-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer text-left"
            >
              {/* Media Container (Photo or Video) */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 shrink-0">
                {event.isVideo ? (
                  <video
                    src={event.coverMedia}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    onLoadedMetadata={(e) => {
                      e.currentTarget.muted = true;
                      e.currentTarget.play().catch(() => {});
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <img
                    src={event.coverMedia}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Category Badge */}
                {event.category && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 pointer-events-none z-10">
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white shadow-sm border border-white/10 truncate max-w-[120px]">
                      {event.category}
                    </span>
                  </div>
                )}

                {/* Hover Overlay Button */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
                  <span className="text-[11px] font-semibold text-white bg-neutral-900/90 px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-white/20">
                    View Event
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>

              {/* Event Details Content (No Price Tag) */}
              <div className="p-2 sm:p-2.5 md:p-3 flex flex-col justify-between flex-1 gap-1.5 min-w-0">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold font-body text-neutral-900 dark:text-neutral-100 truncate group-hover:text-turquoise-600 dark:group-hover:text-turquoise-400 transition-colors">
                    {event.name}
                  </h3>
                </div>

                <div className="space-y-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                  {event.date && (
                    <div className="flex items-center gap-1 truncate">
                      <CalendarDays className="w-3 h-3 shrink-0 text-neutral-400" />
                      <span className="truncate">{event.date}</span>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 shrink-0 text-neutral-400" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
