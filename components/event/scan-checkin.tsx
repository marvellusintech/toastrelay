"use client";

import { Loader2, QrCode, ScanLine, X } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { useScanCheckIn } from "@/app/_queries/pass";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CameraScanner } from "./camera-scanner";
import type { ScanCheckInResult } from "@/types/response";

export function ScanCheckInPanel() {
  const [payload, setPayload] = useState("");
  const [result, setResult] = useState<ScanCheckInResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mutation = useScanCheckIn();

  const processPayload = useCallback(
    async (raw: string) => {
      let normalized = raw.trim();
      if (!normalized) return;
      try {
        normalized = decodeURIComponent(normalized);
      } catch {
        // Not URL-encoded; leave as-is.
      }

      setError(null);
      try {
        const res = await mutation.mutateAsync({ payload: normalized });
        setResult(res.data ?? null);
        setPayload("");
        toast.success("Check-in successful");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to process check-in";
        setError(message);
        toast.error(message);
      }
    },
    [mutation],
  );

  async function handleManualScan() {
    if (!payload.trim()) {
      setError("Paste a QR payload to check in a guest.");
      return;
    }
    await processPayload(payload);
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

      <FieldGroup className="mt-4 gap-4">
        <Field data-invalid={Boolean(error)}>
          <FieldLabel htmlFor="scan-payload">QR payload</FieldLabel>
          <Textarea
            id="scan-payload"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            placeholder="Paste the QR payload scanned from the guest's pass…"
            rows={4}
            aria-invalid={Boolean(error)}
            disabled={mutation.isPending}
          />
          {error && <FieldError errors={[{ message: error }]} />}
        </Field>
      </FieldGroup>

      <Button
        onClick={handleManualScan}
        disabled={mutation.isPending}
        className="mt-5"
      >
        {mutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <QrCode className="h-4 w-4" />
        )}
        Check in guest
      </Button>
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
              {result.type === "TICKET" ? (
                <p className="text-xs text-muted-foreground">Tier: {result.tier}</p>
              ) : (
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
