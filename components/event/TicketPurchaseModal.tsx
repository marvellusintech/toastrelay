"use client";

import * as React from "react";
import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initializePaymentApi } from "@/lib/api/payments";
import { PaymentIntentType, PaymentProvider } from "@/types/enum";
import { TicketTier } from "@/types/response";

interface TicketPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tiers: TicketTier[];
  currency: string;
  eventId: string;
  eventName: string;
  slug: string;
  success?: boolean;
}

const SERVICE_FEE_PERCENT = 0.05;
const SERVICE_FEE_FLAT_NGN = 100;

function calculateFees(unitPrice: number, quantity: number, currency: string) {
  const subtotal = unitPrice * quantity;
  const perTicketFee =
    unitPrice * SERVICE_FEE_PERCENT +
    (currency === "NGN" ? SERVICE_FEE_FLAT_NGN : 0);
  const serviceFee = perTicketFee * quantity;
  return {
    subtotal,
    serviceFee: Math.round(serviceFee * 100) / 100,
    total: Math.round((subtotal + serviceFee) * 100) / 100,
  };
}

function formatPrice(amount: number, currency: string) {
  if (currency === "USD") return `$${amount.toLocaleString()}`;
  return `₦${amount.toLocaleString()}`;
}

export default function TicketPurchaseModal({
  open,
  onOpenChange,
  tiers,
  currency,
  eventId,
  eventName,
  slug,
  success = false,
}: TicketPurchaseModalProps) {
  const [selectedTierId, setSelectedTierId] = useState<string | null>(
    tiers.length === 1 ? tiers[0].id : null,
  );
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callbackUrl = `${window.location.origin}/events/${slug}`;

  const selectedTier = tiers.find((t) => t.id === selectedTierId);
  const remaining = selectedTier
    ? Math.max(selectedTier.capacity - selectedTier.sold, 0)
    : 0;

  const fees = selectedTier
    ? calculateFees(Number(selectedTier.price), quantity, currency)
    : null;

  const isFree = selectedTier && Number(selectedTier.price) === 0;

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900">
                Ticket Confirmed
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
                Your ticket{quantity > 1 ? "s" : ""} have been confirmed and a
                pass has been sent to{" "}
                <span className="font-semibold text-zinc-700">{email}</span>.
              </p>
            </div>
            <Button
              type="button"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  async function handlePurchase() {
    if (!selectedTier || !email.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await initializePaymentApi({
        amount: fees?.total ?? 0,
        currency,
        provider: PaymentProvider.PAYSTACK,
        intentType: PaymentIntentType.TICKET,
        intentId: selectedTier.id,
        quantity,
        callbackUrl,
        email: email.trim(),
        eventId,
        metadata: { eventName, tierName: selectedTier.name },
      });

      const authUrl =
        (res.data as Record<string, unknown>)?.authorizationUrl ||
        (res.data as Record<string, unknown>)?.authorization_url;

      if (authUrl && typeof authUrl === "string") {
        window.location.assign(authUrl);
      } else {
        setError("Payment gateway is not available. Please try again.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to start payment.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get Tickets</DialogTitle>
          <DialogDescription>{eventName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Tier Selection */}
          {tiers.length > 1 && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Select Tier
              </Label>
              <div className="space-y-2">
                {tiers.map((tier) => {
                  const tierRemaining = Math.max(
                    tier.capacity - tier.sold,
                    0,
                  );
                  const isSoldOut = tierRemaining === 0;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      disabled={isSoldOut}
                      onClick={() => {
                        setSelectedTierId(tier.id);
                        setQuantity(1);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        selectedTierId === tier.id
                          ? "border-zinc-900 ring-1 ring-zinc-900 bg-zinc-50"
                          : "border-zinc-200 hover:border-zinc-300"
                      } ${isSoldOut ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-900">
                          {tier.name}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {isSoldOut
                            ? "Sold out"
                            : `${tierRemaining} remaining`}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-zinc-900 whitespace-nowrap">
                        {Number(tier.price) === 0
                          ? "Free"
                          : formatPrice(Number(tier.price), currency)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Single tier still needs selection */}
          {tiers.length === 1 && selectedTier && (
            <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {selectedTier.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {remaining === 0 ? "Sold out" : `${remaining} remaining`}
                  </p>
                </div>
                <span className="text-sm font-bold text-zinc-900">
                  {isFree
                    ? "Free"
                    : formatPrice(Number(selectedTier.price), currency)}
                </span>
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="ticket-email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Email (for ticket delivery)
            </Label>
            <Input
              id="ticket-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Quantity */}
          {selectedTier && !isFree && remaining > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Quantity
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={quantity <= 1 || isSubmitting}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </Button>
                <span className="text-sm font-semibold text-zinc-900 w-8 text-center">
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={quantity >= Math.min(remaining, 10) || isSubmitting}
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          {fees && !isFree && (
            <div className="space-y-1.5 rounded-xl bg-zinc-50 p-3 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal ({quantity}× {formatPrice(Number(selectedTier!.price), currency)})</span>
                <span>{formatPrice(fees.subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Service fee</span>
                <span>{formatPrice(fees.serviceFee, currency)}</span>
              </div>
              <div className="border-t border-zinc-200 pt-1.5 flex justify-between font-bold text-zinc-900">
                <span>Total</span>
                <span>{formatPrice(fees.total, currency)}</span>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 leading-relaxed">{error}</p>
          )}

          {/* Submit */}
          <Button
            type="button"
            className="w-full"
            disabled={
              isSubmitting ||
              !selectedTier ||
              !email.trim() ||
              remaining === 0
            }
            onClick={handlePurchase}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Processing…
              </span>
            ) : isFree ? (
              "Register for Free"
            ) : (
              `Pay ${formatPrice(fees?.total ?? 0, currency)}`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
