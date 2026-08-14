"use client";

import * as React from "react";
import { Loader2, Ticket, RefreshCw, Calendar, Clock, ArrowRight } from "lucide-react";

import { useAllMyPasses } from "@/app/_queries/pass";
import { Button } from "@/components/ui/button";
import { UserPass } from "@/types/response";
import { EventPassModal } from "@/components/event/EventPassModal";
import { isVideoUrl } from "@/lib/utils/media";
import { getFileUrl } from "@/lib/utils/getFileUrl";

function formatShortDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(date: Date | string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function EventThumb({ src, alt }: { src: string; alt: string }) {
  const url = getFileUrl(src);
  if (isVideoUrl(src)) {
    return (
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
        <video
          src={url}
          preload="metadata"
          muted
          playsInline
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
      <img
        src={url}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

function PassRow({ pass, onClick }: { pass: UserPass; onClick: () => void }) {
  const isCheckedIn = pass.status === "USED" || Boolean(pass.checkedInAt);

  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-xl border border-line bg-white p-4 text-left transition hover:border-turquoise/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-turquoise"
    >
      {pass.event.coverImage ? (
        <EventThumb src={pass.event.coverImage} alt={pass.event.name} />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-turquoise/10">
          <Ticket className="h-5 w-5 text-turquoise" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-bold text-foreground">
            {pass.event.name}
          </h3>
          {isCheckedIn && (
            <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
              Checked in
            </span>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatShortDate(pass.event.startDate)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(pass.event.startDate)}
          </span>
          {pass.attendee.detail && (
            <>
              <span className="text-line">·</span>
              <span>{pass.attendee.detail}</span>
            </>
          )}
        </div>
      </div>

      <div className="shrink-0 rounded-full border border-line p-2 text-muted-foreground transition group-hover:border-turquoise group-hover:text-turquoise">
        <ArrowRight className="h-4 w-4" />
      </div>
    </button>
  );
}

export default function PassesPage() {
  const { data, isLoading, isError, refetch, isRefetching } = useAllMyPasses();
  const [selectedPass, setSelectedPass] = React.useState<UserPass | null>(null);

  const passes = data?.data ?? [];

  return (
    <main className="bg-[#FAF9F6] min-h-screen">
      <div className="mx-auto w-full max-w-3xl px-6 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mt-2 text-3xl font-black font-display md:text-4xl">
              My passes
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap a pass to view your QR code and check-in details.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <RefreshCw className={`h-4 w-4 mr-1.5 ${isRefetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center text-sm text-muted-foreground">
              <p>Unable to load your passes.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching}>
                <RefreshCw className="h-4 w-4 mr-1.5" />
                Retry
              </Button>
            </div>
          ) : passes.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <Ticket className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-base font-semibold text-foreground">No passes yet</p>
              <p className="max-w-sm text-xs text-muted-foreground">
                When you RSVP to an event or buy a ticket, your QR pass will appear here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {passes.map((pass) => (
                <PassRow
                  key={pass.id}
                  pass={pass}
                  onClick={() => setSelectedPass(pass)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedPass && (
        <EventPassModal
          open={Boolean(selectedPass)}
          onOpenChange={(open) => {
            if (!open) setSelectedPass(null);
          }}
          eventId={selectedPass.event.id}
          eventName={selectedPass.event.name}
          preloadedPass={selectedPass}
        />
      )}
    </main>
  );
}
