"use client";

import React from "react";
import { MapPin, Navigation, Loader2, X, RotateCcw, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LocationBannerProps {
  onUseLocation: () => void;
  onResetLocation: () => void;
  isLocating: boolean;
  isActive: boolean;
  userAddress?: string;
  error?: string | null;
  onDismiss?: () => void;
  className?: string;
}

export function LocationBanner({
  onUseLocation,
  onResetLocation,
  isLocating,
  isActive,
  userAddress,
  error,
  onDismiss,
  className,
}: LocationBannerProps) {
  return (
    <div
      className={cn(
        "relative w-full rounded-xl border transition-all duration-200 overflow-hidden",
        isActive
          ? "bg-teal-50/70 dark:bg-teal-950/30 border-teal-200/80 dark:border-teal-900/40"
          : "bg-neutral-50/90 dark:bg-neutral-900/60 border-neutral-200/70 dark:border-neutral-800",
        className,
      )}
    >
      <div className="py-2 px-3 sm:px-4 flex items-center justify-between gap-3 min-h-[44px]">
        {/* Left: Icon & Text inline */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div
            className={cn(
              " w-7 h-7 rounded-lg shrink-0 hidden md:flex items-center justify-center transition-colors",
              isActive
                ? "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                : "bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400",
            )}
          >
            {isActive ? (
              <Navigation className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
            ) : (
              <MapPin className="w-3.5 h-3.5" />
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 font-body">
                Find events near you
              </span>
              {isActive && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 shrink-0">
                  <span className="w-1 h-1 rounded-full bg-teal-500 animate-pulse" />
                  {userAddress || "Near you"}
                </span>
              )}
            </div>

            <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700 text-xs">
              •
            </span>

            <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {error ? (
                <span className="text-red-500 font-medium">{error}</span>
              ) : isActive ? (
                `Sorted by proximity to ${userAddress || "your location"}`
              ) : (
                "See events happening around your current location."
              )}
            </p>
          </div>
        </div>

        {/* Right: Actions & Dismiss */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isActive ? (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onResetLocation}
                className="h-7 px-2.5 text-xs font-medium gap-1 text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer rounded-lg"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden xs:inline">Reset</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onUseLocation}
                disabled={isLocating}
                className="h-7 px-2.5 text-xs font-medium gap-1 rounded-lg border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 cursor-pointer"
              >
                {isLocating ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Navigation className="w-3 h-3" />
                )}
                <span>Update</span>
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={onUseLocation}
              disabled={isLocating}
              className="h-7 sm:h-8 px-3 text-xs font-semibold gap-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 cursor-pointer shadow-none"
            >
              {isLocating ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <MapPin className="w-3 h-3" />
                  <span>Use my location</span>
                </>
              )}
            </Button>
          )}

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss banner"
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer ml-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

