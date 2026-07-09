// app/(dashboard)/events/[eventId]/setup/_components/step-logistics.tsx
"use client";

import { Controller, FieldPath, useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { type WizardFormValues } from "@/validations/event.schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DatePicker } from "@/components/DatePicker";

export function StepLogistics() {
  const router = useRouter();
  const {
    register,
    watch,
    trigger,
    control, 
    formState: { errors },
  } = useFormContext<WizardFormValues>();

  const isExternal = watch("isExternal");

  const handleNext = async () => {
    const fieldsToValidate: FieldPath<WizardFormValues>[] = [
      "name",
      "slug",
      "startDate",
      "endDate",
    ];

    if (isExternal) {
      fieldsToValidate.push("externalUrl");
    } else {
      fieldsToValidate.push("location");
    }
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      router.push("?step=branding");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Event Logistics</h2>
        <p className="text-sm text-zinc-500">
          Where and when is this happening?
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-zinc-700">
            Event Name
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full mt-1 p-2.5 border rounded-xl bg-zinc-50 focus:bg-white text-sm"
            placeholder="e.g., ToastRelay Gala Night"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-700">URL Slug</label>
          <input
            type="text"
            {...register("slug")}
            className="w-full mt-1 p-2.5 border rounded-xl bg-zinc-50 focus:bg-white text-sm font-mono"
            placeholder="gala-night-2026"
          />
          {errors.slug && (
            <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-zinc-700">
              Start Date
            </label>
            <div className="mt-1">
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <DatePicker 
                    date={field.value ? new Date(field.value) : undefined} 
                    setDate={field.onChange} 
                  />
                )}
              />
            </div>
            {errors.startDate && (
              <p className="text-xs text-red-500 mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700">
              End Date (Optional)
            </label>
            <div className="mt-1">
              <Controller
                control={control}
                name="endDate"
                render={({ field }) => (
                  <DatePicker 
                    date={field.value ? new Date(field.value) : undefined} 
                    setDate={field.onChange} 
                  />
                )}
              />
            </div>
            {errors.endDate && (
              <p className="text-xs text-red-500 mt-1">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border">
          <div>
            <label className="text-sm font-medium text-zinc-800 block">
              External Hosting
            </label>
            <span className="text-xs text-zinc-500">
              This event is ticketing or streaming somewhere else
            </span>
          </div>
          <input
            type="checkbox"
            {...register("isExternal")}
            className="h-4 w-4 rounded text-zinc-900 border-zinc-300 focus:ring-zinc-950"
          />
        </div>

        {isExternal ? (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="text-sm font-medium text-zinc-700">
              External Platform URL
            </label>
            <input
              type="url"
              {...register("externalUrl")}
              className="w-full mt-1 p-2.5 border rounded-xl bg-zinc-50 focus:bg-white text-sm"
              placeholder="https://zoom.us/j/... or https://ticketlink.com"
            />
            {errors.externalUrl && (
              <p className="text-xs text-red-500 mt-1">
                {errors.externalUrl.message}
              </p>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="text-sm font-medium text-zinc-700">
              Physical Location / Venue
            </label>
            <input
              type="text"
              {...register("location")}
              className="w-full mt-1 p-2.5 border rounded-xl bg-zinc-50 focus:bg-white text-sm"
              placeholder="e.g., Calgary Central Library Ballroom"
            />
            {errors.location && (
              <p className="text-xs text-red-500 mt-1">
                {errors.location.message}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Link href="/dashboard/events">
          <Button variant={"outline"} type="button">
            Cancel
          </Button>
        </Link>
        <Button
          variant={"secondary"}
          type="button"
          className="flex-1 lg:flex-initial"
          onClick={handleNext}
        >
          Continue to Branding
        </Button>
      </div>
    </div>
  );
}