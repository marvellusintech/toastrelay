// app/(dashboard)/events/[eventId]/setup/_components/step-logistics.tsx
"use client";

import { Controller, FieldPath, useFormContext } from "react-hook-form";
import { type WizardFormValues } from "@/validations/event.schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DatePicker } from "@/components/DatePicker";
import {
  Check,
  ChevronsUpDown,
  Loader2,
  Wifi,
  MapPin,
  Users,
  Camera,
  Globe2,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import { EventType } from "@/types/response";
import { getEventCatgoriesApi } from "@/lib/api/events";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface StepProps {
  onNext: () => Promise<void>;
  isSaving: boolean;
}

export function StepLogistics({ onNext, isSaving }: StepProps) {
  const {
    register,
    watch,
    trigger,
    control,
    formState: { errors },
    setValue,
  } = useFormContext<WizardFormValues>();

  const [openCategory, setOpenCategory] = React.useState(false);
  const [eventTypes, setEventTypes] = React.useState<EventType[]>([]);
  const [isLoadingMeta, setIsLoadingMeta] = React.useState(true);

  const isExternal = watch("isExternal");
  const isPublic = watch("isPublic");
  const format = watch("format");
  const allowRsvp = watch("allowRsvp");
  const allowMoments = watch("allowMoments");

  // Watch date values explicitly to compute memoized Date references
  const startDateValue = watch("startDate");
  const endDateValue = watch("endDate");

  // Prevent inline instantiation of new Date() on every single render pass
  const startDateObject = React.useMemo(() => {
    if (!startDateValue) return undefined;
    const parsed = new Date(startDateValue);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }, [startDateValue]);

  const endDateObject = React.useMemo(() => {
    if (!endDateValue) return undefined;
    const parsed = new Date(endDateValue);
    return isNaN(parsed.getTime()) ? undefined : parsed;
  }, [endDateValue]);

  const handleNext = async () => {
    const fieldsToValidate: FieldPath<WizardFormValues>[] = [
      "name",
      "slug",
      "startDate",
      "endDate",
      "format",
    ];

    if (format === "PHYSICAL" || format === "HYBRID") {
      fieldsToValidate.push("location");
    }

    if (format === "ONLINE" || format === "HYBRID") {
      fieldsToValidate.push("onlineUrl");
    }

    if (isExternal) {
      fieldsToValidate.push("externalUrl");
    }

    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      await onNext();
    }
  };

  React.useEffect(() => {
    async function fetchMetadata() {
      try {
        setIsLoadingMeta(true);
        const [categoriesRes] = await Promise.all([getEventCatgoriesApi()]);

        const parsedCategories = categoriesRes as unknown;

        if (Array.isArray(parsedCategories)) {
          setEventTypes(parsedCategories);
        } else if (
          parsedCategories &&
          typeof parsedCategories === "object" &&
          "data" in parsedCategories &&
          Array.isArray((parsedCategories as { data: unknown }).data)
        ) {
          setEventTypes((parsedCategories as { data: EventType[] }).data);
        }
      } catch (error) {
        console.error("Failed to load event metadata:", error);
      } finally {
        setIsLoadingMeta(false);
      }
    }

    fetchMetadata();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with isExternal toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900">Event Logistics</h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Where and when is this happening?
          </p>
        </div>
        <div className="flex items-center self-start sm:self-auto gap-2 bg-zinc-50 border border-zinc-200 rounded-full px-3 py-1.5 shrink-0">
          <Switch
            checked={isExternal}
            onCheckedChange={(checked) => {
              setValue("isExternal", checked, { shouldValidate: true });
              if (!checked) {
                setValue("externalUrl", undefined, { shouldValidate: true });
              }
            }}
          />
          <span className="text-xs font-medium text-zinc-700 whitespace-nowrap">
            External Event
          </span>
        </div>
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
            placeholder="e.g., Toastrelay Gala Night"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900 block">
            Event Category
          </label>
          <Controller
            name="eventTypeId"
            control={control}
            render={({ field }) => (
              <Popover open={openCategory} onOpenChange={setOpenCategory}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCategory}
                    disabled={isLoadingMeta}
                    className="w-full justify-between h-11 bg-white border-zinc-200 hover:bg-zinc-50 text-left font-normal"
                  >
                    {isLoadingMeta ? (
                      <span className="flex items-center gap-2 text-zinc-400">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading
                        categories...
                      </span>
                    ) : field.value ? (
                      eventTypes.find(
                        (type) =>
                          type.id === field.value || type.name === field.value,
                      )?.label ||
                      eventTypes.find(
                        (type) =>
                          type.id === field.value || type.name === field.value,
                      )?.name ||
                      "Select event category..."
                    ) : (
                      "Select event category..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                >
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {eventTypes.map((type) => {
                          const typeId = type.id;
                          const typeLabel = type.label || type.name;
                          return (
                            <CommandItem
                              key={typeId}
                              value={typeLabel}
                              onSelect={() => {
                                setValue("eventTypeId", typeId, {
                                  shouldValidate: true,
                                });
                                setOpenCategory(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === typeId
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {typeLabel}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.eventTypeId && (
            <p className="text-xs text-red-500">{errors.eventTypeId.message}</p>
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
          {/* Start Date */}
          <div>
            <label className="text-sm font-medium text-zinc-700">
              Start Date & Time
            </label>
            <div className="mt-1">
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <DatePicker
                    date={startDateObject}
                    setDate={(selected) => {
                      // Pass the Date object (or null/undefined) directly to Zod
                      field.onChange(selected ?? undefined);
                    }}
                    showTime
                    placeholder="Pick start date & time"
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

          {/* End Date */}
          <div>
            <label className="text-sm font-medium text-zinc-700">
              End Date & Time (Optional)
            </label>
            <div className="mt-1">
              <Controller
                control={control}
                name="endDate"
                render={({ field }) => (
                  <DatePicker
                    date={endDateObject}
                    setDate={(selected) => {
                      // Pass the Date object (or null/undefined) directly to Zod
                      field.onChange(selected ?? undefined);
                    }}
                    showTime
                    placeholder="Pick end date & time"
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

        {/* Event Format */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-900 block">
            Event Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["PHYSICAL", "ONLINE", "HYBRID"] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => {
                  setValue("format", fmt, { shouldValidate: true });
                  if (fmt === "ONLINE") {
                    setValue("location", undefined, { shouldValidate: true });
                  }
                  if (fmt === "PHYSICAL") {
                    setValue("onlineUrl", undefined, { shouldValidate: true });
                  }
                }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 px-2 sm:p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all min-w-0 ${
                  format === fmt
                    ? "border-zinc-950 bg-zinc-950 text-white shadow-sm"
                    : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {fmt === "PHYSICAL" && <MapPin className="w-4 h-4 shrink-0" />}
                {fmt === "ONLINE" && <Wifi className="w-4 h-4 shrink-0" />}
                {fmt === "HYBRID" && (
                  <div className="flex items-center gap-0.5 shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                    <Wifi className="w-3.5 h-3.5" />
                  </div>
                )}
                <span className="truncate">{fmt.charAt(0) + fmt.slice(1).toLowerCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Location & Online URL — grouped by format */}
        {(format === "PHYSICAL" || format === "HYBRID") && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="text-sm font-medium text-zinc-700">
              Physical Location / Venue
            </label>
            <input
              type="text"
              {...register("location")}
              className="w-full mt-1 p-2.5 border rounded-xl bg-zinc-50 focus:bg-white text-sm min-w-0"
              placeholder="e.g., Calgary Central Library Ballroom"
            />
            {errors.location && (
              <p className="text-xs text-red-500 mt-1">
                {errors.location.message}
              </p>
            )}
          </div>
        )}

        {(format === "ONLINE" || format === "HYBRID") && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="text-sm font-medium text-zinc-700">
              Online URL
            </label>
            <input
              type="url"
              {...register("onlineUrl")}
              className="w-full mt-1 p-2.5 border rounded-xl bg-zinc-50 focus:bg-white text-sm min-w-0"
              placeholder="https://zoom.us/j/... or https://meet.google.com/..."
            />
            <p className="text-xs text-zinc-500 mt-1">
              Direct link for guests to join this online event (e.g., Zoom, Google Meet, YouTube Live).
            </p>
            {errors.onlineUrl && (
              <p className="text-xs text-red-500 mt-1">
                {errors.onlineUrl.message}
              </p>
            )}
          </div>
        )}

        {/* External Platform URL */}
        {isExternal && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <label className="text-sm font-medium text-zinc-700">
              External Platform URL
            </label>
            <input
              type="url"
              {...register("externalUrl")}
              className="w-full mt-1 p-2.5 border rounded-xl bg-zinc-50 focus:bg-white text-sm min-w-0"
              placeholder="https://eventbrite.com/e/... or https://lu.ma/..."
            />
            <p className="text-xs text-zinc-500 mt-1">
              Link to the external platform where this event is hosted or ticketed.
            </p>
            {errors.externalUrl && (
              <p className="text-xs text-red-500 mt-1">
                {errors.externalUrl.message}
              </p>
            )}
          </div>
        )}

        {/* Event settings toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3.5 sm:p-4 bg-zinc-50 rounded-xl border gap-3">
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-zinc-600 shrink-0" />
                <label className="text-sm font-medium text-zinc-800">
                  Public Event
                </label>
              </div>
              <span className="text-xs text-zinc-500 line-clamp-2 sm:line-clamp-none">
                {isPublic
                  ? "Anyone can discover and view this event"
                  : "Only guests with your event link can view it"}
              </span>
            </div>
            <Switch
              className="shrink-0"
              checked={isPublic}
              onCheckedChange={(checked) => setValue("isPublic", checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3.5 sm:p-4 bg-zinc-50 rounded-xl border gap-3">
            <div className="space-y-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-zinc-600 shrink-0" />
                <label className="text-sm font-medium text-zinc-800">
                  Allow RSVPs
                </label>
              </div>
              <span className="text-xs text-zinc-500">
                Guests can confirm attendance
              </span>
            </div>
            <Switch
              className="shrink-0"
              checked={allowRsvp}
              onCheckedChange={(checked) => setValue("allowRsvp", checked)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-zinc-100">
        <Link href="/dashboard/events" className="sm:w-auto">
          <Button variant={"outline"} type="button">
            Cancel
          </Button>
        </Link>
        <Button
          variant={"secondary"}
          type="button"
          className="flex-1 sm:flex-initial"
          onClick={handleNext}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Continue to Branding"
          )}
        </Button>
      </div>
    </div>
  );
}
