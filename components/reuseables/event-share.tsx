"use client";

import * as React from "react";
import { Check, Copy, QrCode as QrCodeIcon, Share2 } from "lucide-react";
import QRCode from "qrcode";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface EventShareProps {
  slug: string;
  eventName: string;
  className?: string;
  triggerClassName?: string;
  triggerLabel?: string;
}

export function EventShare({
  slug,
  eventName,
  className,
  triggerClassName,
  triggerLabel = "Share",
}: EventShareProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);

  const getEventUrl = () => `${window.location.origin}/events/${slug}`;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const copyLink = async () => {
    const eventUrl = getEventUrl();

    try {
      await navigator.clipboard.writeText(eventUrl);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = eventUrl;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      const didCopy = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (!didCopy) {
        toast.error("Unable to copy the event link.");
        return;
      }
    }

    setIsCopied(true);
    toast.success("Event link copied.");
    window.setTimeout(() => setIsCopied(false), 2000);
  };

  const shareNatively = async () => {
    const eventUrl = getEventUrl();

    if (!navigator.share) {
      toast.error("Native sharing is not available on this device.");
      return;
    }

    try {
      await navigator.share({
        title: eventName,
        text: `Join me at ${eventName}`,
        url: eventUrl,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error("Unable to share this event.");
    }
  };

  const downloadQrCode = async () => {
    try {
      const qrCodeUrl = await QRCode.toDataURL(getEventUrl(), {
        width: 1024,
        margin: 2,
        errorCorrectionLevel: "M",
      });
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = `${eventName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "event"}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("QR code downloaded.");
    } catch {
      toast.error("Unable to generate the QR code.");
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn("gap-2", triggerClassName)}
        >
          <Share2 className="h-4 w-4" />
          {triggerLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className={cn("w-64 p-2", className)}>
        <div className="space-y-1">
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start"
            onClick={copyLink}
          >
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            Copy link
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start"
            onClick={shareNatively}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start"
            onClick={downloadQrCode}
          >
            <QrCodeIcon className="h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
