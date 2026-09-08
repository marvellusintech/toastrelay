"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2, ScanLine, Ticket, X } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { useCheckInByCode, useScanCheckIn } from "@/app/_queries/pass";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { queryKeys } from "@/lib/api/query_keys";
import { CameraScanner } from "./camera-scanner";

type CheckInResult = {
  type: "TICKET" | "RSVP";
  attendee: string;
  tier?: string;
  rsvpStatus?: string;
  checkedInAt?: string | null;
};

interface ScanCheckInPanelProps {
  eventId?: string;
}

export function ScanCheckInPanel({ eventId }: ScanCheckInPanelProps = {}) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const scanMutation = useScanCheckIn();
  const checkInByCodeMutation = useCheckInByCode();

  const handleSuccessfulCheckIn = useCallback(() => {
    if (eventId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.events.guests(eventId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.events.detail(eventId) });
    }
  }, [eventId, queryClient]);

  const processPayload = useCallback(
    async (raw: string) => {
      let normalized = raw.trim();
      if (!normalized) return;
      try {
        normalized = decodeURIComponent(normalized);
      } catch {
        // Not URL-encoded; leave as-is.
      }

      try {
        const res = await scanMutation.mutateAsync({ payload: normalized });
        if (res.data) {
          setResult({
            type: res.data.type,
            attendee: res.data.attendee,
            tier: res.data.type === "TICKET" ? res.data.tier : undefined,
            rsvpStatus:
              res.data.type === "RSVP" ? res.data.rsvpStatus : undefined,
            checkedInAt: res.data.checkedInAt,
          });
        }
        handleSuccessfulCheckIn();
        toast.success("Check-in successful");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to process check-in";
        toast.error(message);
      }
    },
    [scanMutation, handleSuccessfulCheckIn],
  );

  async function handleCheckInByCode(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) {
      setCodeError("Enter a check-in code to check in a guest.");
      return;
    }

    setCodeError(null);
    try {
      const res = await checkInByCodeMutation.mutateAsync({
        code: normalizedCode,
      });
      const data = res.data;
      if (data) {
        setResult({
          type: "TICKET",
          attendee:
            data.buyerEmail ||
            (data.checkinCode ? `Code: ${data.checkinCode}` : "Ticket Holder"),
          tier: data.tier,
          checkedInAt: data.checkedInAt,
        });
      }
      setCode("");
      handleSuccessfulCheckIn();
      toast.success("Check-in successful");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to process check-in";
      setCodeError(message);
      toast.error(message);
    }
  }

  return (
    <Card className="px-6 py-6">
      <div className="flex items-center gap-2">
        <ScanLine className="h-5 w-5 text-turquoise" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Scan check-in
        </h3>
      </div>

      <CameraScanner onDetected={(value) => void processPayload(value)} />

      <form onSubmit={handleCheckInByCode} className="mt-4">
        <FieldGroup className="gap-4">
          <Field data-invalid={Boolean(codeError)}>
            <FieldLabel htmlFor="checkin-code">Check-in code</FieldLabel>
            <Input
              id="checkin-code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (codeError) setCodeError(null);
              }}
              placeholder="Enter check-in code…"
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              aria-invalid={Boolean(codeError)}
              disabled={checkInByCodeMutation.isPending}
            />
            {codeError && <FieldError errors={[{ message: codeError }]} />}
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          disabled={checkInByCodeMutation.isPending || !code.trim()}
          className="mt-5 w-full"
         
        >
          {checkInByCodeMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Ticket className="h-4 w-4" />
          )}
          Check in guest
        </Button>
      </form>

      <p className="mt-2 text-xs text-muted-foreground">
        Only hosts and authorized circles can process check-ins for this event.
      </p>

      {result && (
        <div className="mt-5 rounded-xl border border-line bg-muted/40 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {result.type === "TICKET" ? "Ticket" : "RSVP"} checked in
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {result.attendee}
              </p>
              {result.type === "TICKET" && result.tier && (
                <p className="text-xs text-muted-foreground">
                  Tier: {result.tier}
                </p>
              )}
              {result.type === "RSVP" && result.rsvpStatus && (
                <p className="text-xs text-muted-foreground">
                  RSVP: {result.rsvpStatus}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                {result.checkedInAt
                  ? new Date(result.checkedInAt).toLocaleString()
                  : "Checked in"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setResult(null)}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Dismiss result"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
