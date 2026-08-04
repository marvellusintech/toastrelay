"use client";

import { Loader2, Ticket, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { getUserEventsApi } from "@/lib/api/events";
import { useMyPass } from "@/app/_queries/pass";
import { QrCode } from "@/components/ui/qr-code";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { queryKeys } from "@/lib/api/query_keys";

function PassCard({ eventId }: { eventId: string }) {
  const { data, isLoading, isError } = useMyPass(eventId);

  if (isLoading) {
    return (
      <Card className="flex h-56 items-center justify-center px-6 py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </Card>
    );
  }

  if (isError || !data?.data) {
    return (
      <Card className="flex h-56 flex-col items-center justify-center gap-3 px-6 py-8 text-center text-sm text-muted-foreground">
        <p>No pass yet for this event.</p>
        <p className="text-xs">
          RSVP or buy a ticket to get your QR pass.
        </p>
      </Card>
    );
  }

  const pass = data.data;

  return (
    <Card className="flex flex-col items-center px-6 py-8 text-center">
      <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {pass.type === "TICKET" ? "Ticket pass" : "Guest pass"}
      </span>

      <div className="my-5 rounded-2xl border border-line bg-white p-4">
        <QrCode value={pass.payload} size={168} />
      </div>

      <h3 className="text-base font-bold text-foreground">{pass.attendee.name}</h3>
      {pass.attendee.detail && (
        <p className="mt-1 text-xs text-muted-foreground">{pass.attendee.detail}</p>
      )}
      <p className="mt-3 text-[10px] text-muted-foreground">
        Show this code at the door to check in.
      </p>
    </Card>
  );
}

export default function PassesPage() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: queryKeys.events.list({ role: "guest", limit: 50 }),
    queryFn: () => getUserEventsApi({ role: "guest", limit: 50 }),
  });

  const guestEvents = data?.data?.events ?? [];

  return (
    <main className="bg-[#FAF9F6]">
      <div className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mt-2 text-4xl font-black font-display md:text-2xl">
              My passes
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your QR passes for events you&apos;ve RSVP&apos;d to or bought tickets for.
            </p>
          </div>
          <Link href="/dashboard" className="shrink-0">
            <Button variant="secondary" size="sm">Back to dashboard</Button>
          </Link>
        </div>

        <div className="py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center text-sm text-muted-foreground">
              <p>Unable to load your passes.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching}>
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          ) : guestEvents.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center">
              <Ticket className="h-8 w-8 text-muted" />
              <p className="text-sm font-semibold text-foreground">No passes yet</p>
              <p className="max-w-sm text-xs text-muted-foreground">
                When you RSVP to an event or buy a ticket, your QR pass will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {guestEvents.map((event) => (
                <PassCard key={event.id} eventId={event.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
