// app/(dashboard)/events/[eventId]/setup/_components/step-review.tsx
"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { type WizardFormValues } from "@/validations/event.schema";
import { Button } from "@/components/ui/button";
import { publishEventApi } from "@/lib/api/events";


export function StepReview({ eventId }: { eventId: string }) {
  const router = useRouter();
  const { getValues } = useFormContext<WizardFormValues>();
  const [publishing, setPublishing] = useState(false);

  const values = getValues();

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const response = await publishEventApi(eventId);

      router.push(`/dashboard/events/${eventId}`);
      router.refresh();
      return response;
    } catch (error) {
      console.error("Publish error:", error);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Review & Launch</h2>
        <p className="text-sm text-zinc-500">
          Confirm all visual features and setup structures before going live.
        </p>
      </div>

      <div className="border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-100 text-sm">
        <div className="p-4 bg-zinc-50/50 flex justify-between">
          <span className="font-medium text-zinc-500">Event Label</span>
          <span className="font-semibold text-zinc-800">
            {values.name || "Not Configured"}
          </span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="font-medium text-zinc-500">Hosting Mode</span>
          <span className="font-semibold text-zinc-800">
            {values.isExternal
              ? "External Redirect"
              : "Internal Platform Native"}
          </span>
        </div>
        <div className="p-4 bg-zinc-50/50 flex justify-between">
          <span className="font-medium text-zinc-500">
            Ticketing Allocation
          </span>
          <span className="font-semibold text-zinc-800">
            {values.enableTicketing
              ? `${values.ticketingData?.tiers?.length || 0} Tiers Set`
              : "Inactive"}
          </span>
        </div>
        <div className="p-4 flex justify-between">
          <span className="font-medium text-zinc-500">Contribution Items</span>
          <span className="font-semibold text-zinc-800">
            {values.enableContributions
              ? `${values.contributionsData?.items?.length || 0} Targets Listed`
              : "Inactive"}
          </span>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button
          type="button"
          disabled={publishing}
          onClick={() => router.push("?step=contributions")}
          variant="outline"
        >
          Back
        </Button>
        <Button
          type="button"
          disabled={publishing}
          onClick={handlePublish}
          variant={"secondary"}
          className="flex-1 lg:flex-initial"
        >
          {publishing ? "Publishing Pipeline Active..." : "Publish Event Live"}
        </Button>
      </div>
    </div>
  );
}
