"use client";

import { ChevronLeft, ScanLine } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScanCheckInPanel } from "@/components/event/scan-checkin";

interface CheckInClientPageProps {
  eventId: string;
  eventName: string;
}

export function CheckInClientPage({ eventId, eventName }: CheckInClientPageProps) {
  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <div className="mx-auto max-w-2xl px-6 py-8 lg:px-10">
        {/* Top bar */}
        <div className="mb-8 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/dashboard/events/${eventId}`}>
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-turquoise/10">
            <ScanLine className="h-5 w-5 text-turquoise" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Check-in</h1>
            <p className="text-xs text-muted-foreground truncate max-w-xs">{eventName}</p>
          </div>
        </div>

        {/* Scanner panel */}
        <ScanCheckInPanel />
      </div>
    </div>
  );
}
