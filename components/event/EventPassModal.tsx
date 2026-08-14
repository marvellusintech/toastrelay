"use client";

import * as React from "react";
import { Loader2, Ticket, X, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode } from "@/components/ui/qr-code";
import { useMyPass } from "@/app/_queries/pass";
import type { UserPass, EventPass } from "@/types/response";

interface EventPassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventName: string;
  preloadedPass?: UserPass;
}

function PassContent({ pass }: { pass: UserPass | EventPass; detail?: string }) {
  const isCheckedIn = "status" in pass ? pass.status === "USED" || Boolean(pass.checkedInAt) : false;
  const attendeeName = pass.attendee.name;
  const attendeeDetail = pass.attendee.detail;
  const passType = pass.type === "TICKET" ? "Ticket Pass" : "Guest Pass";
  const checkinCode = "checkinCode" in pass ? pass.checkinCode : undefined;

  return (
    <div className="flex flex-col items-center w-full text-center">
      <div className="flex items-center gap-3 mb-4">
        <span className="rounded-full bg-turquoise/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-turquoise-dark">
          {passType}
        </span>
        {isCheckedIn && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600">
            <CheckCircle2 className="h-3 w-3" />
            Checked in
          </span>
        )}
      </div>

      <div className="my-4 rounded-2xl border border-line bg-white p-4 shadow-sm">
        <QrCode value={pass.payload} size={200} />
      </div>

      <h3 className="text-lg font-bold text-foreground">{attendeeName}</h3>
      {attendeeDetail && (
        <p className="mt-0.5 text-xs text-muted-foreground">{attendeeDetail}</p>
      )}

      {checkinCode && (
        <div className="mt-4 rounded-xl bg-muted px-5 py-3 text-center">
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
            Check-in Code
          </p>
          <p className="font-mono text-xl font-bold text-foreground tracking-widest mt-1">
            {checkinCode}
          </p>
        </div>
      )}

      <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
        Show this QR code or check-in code at the entrance.
      </p>
    </div>
  );
}

export function EventPassModal({
  open,
  onOpenChange,
  eventId,
  eventName,
  preloadedPass,
}: EventPassModalProps) {
  const { data, isLoading, isError } = useMyPass(open && !preloadedPass ? eventId : undefined);

  const passFromApi = data?.data;

  const loading = !preloadedPass && isLoading;
  const error = !preloadedPass && isError;
  const pass = preloadedPass || passFromApi;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Ticket className="h-4 w-4 text-turquoise" />
            {eventName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center px-6 pb-6 pt-2">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error || !pass ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 px-4 text-center text-sm text-muted-foreground">
              <p>No pass found for this event.</p>
              <p className="text-xs">
                RSVP or buy a ticket to get your QR pass.
              </p>
            </div>
          ) : (
            <PassContent pass={pass} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
