"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FormProvider, useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import React, { Suspense, use, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  eventWizardSchema,
  type WizardFormValues,
} from "@/validations/event.schema";
import { StepLogistics } from "./_components/stepLogistics";
import { StepBranding } from "./_components/stepBranding";
import { StepTicketing } from "./_components/stepTicketing";
import { StepContributions } from "./_components/stepContributions";
import { StepReview } from "./_components/stepReview";
import { getEventByIdApi, updateEventApi } from "@/lib/api/events";
import { EventDetails } from "@/types/response";

const ALL_WIZARD_STEPS = [
  { id: "logistics", title: "Logistics", description: "Dates & Venues" },
  { id: "branding", title: "Branding", description: "Themes & Layouts" },
  { id: "ticketing", title: "Ticketing", description: "Access Allocation" },
  {
    id: "contributions",
    title: "Contributions",
    description: "Gifts & Uniforms",
  },
  { id: "review", title: "Review & Launch", description: "Final Checks" },
] as const;

const STEP_VALIDATION: Record<string, FieldPath<WizardFormValues>[]> = {
  logistics: [
    "name",
    "slug",
    "startDate",
    "endDate",
    "format",
  ],
  branding: ["eventTypeId", "templateId", "description", "coverImage"],
  ticketing: ["ticketingData.tiers"],
  contributions: ["contributionsData.items"],
  review: [],
};

interface PageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default function EventSetupWizardPage({ params }: PageProps) {
  return (
    <Suspense fallback={<SetupWizardLoading />}>
      <EventSetupWizard params={params} />
    </Suspense>
  );
}

function SetupWizardLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted" />
    </div>
  );
}

function EventSetupWizard({ params }: PageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const resolvedParams = use(params);
  const eventId = resolvedParams.eventId;

  const currentStep = searchParams.get("step") || "logistics";

  const [eventData, setEventData] = useState<EventDetails | null>(null);

  useEffect(() => {
    async function fetchAndPopulateEvent() {
      if (!eventId || eventId === "undefined") return;
      try {
        setIsLoading(true);
        const res = await getEventByIdApi(eventId);
        if (res.data) {
          setEventData(res.data);
        }
      } catch (error) {
        console.error("Failed to load event details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAndPopulateEvent();
  }, [eventId]);

  const parsedTheme = useMemo(() => {
    if (!eventData?.theme)
      return {
        primaryColor: "#09090b",
        backgroundColor: "#ffffff",
        borderRadius: "md",
      };
    if (typeof eventData.theme === "string") {
      try {
        return JSON.parse(eventData.theme);
      } catch {
        return {
          primaryColor: "#09090b",
          backgroundColor: "#ffffff",
          borderRadius: "md",
        };
      }
    }
    return eventData.theme;
  }, [eventData]);

  // Memoize so react-hook-form's `values` reference stays stable across
  // renders. An inline literal is recreated every render, which RHF's
  // internal sync effect treats as a change → infinite reset/render loop.
  const wizardValues = useMemo(() => eventData
      ? {
          name: eventData.name ?? "",
          slug: eventData.slug ?? "",
          description: eventData.description ?? "",
          coverImage: eventData.coverImage ?? "",
          extraMedia: eventData.extraMedia ?? [],
          startDate: eventData.startDate
            ? new Date(eventData.startDate)
            : new Date(),
          endDate: eventData.endDate
            ? new Date(eventData.endDate)
            : undefined,
          location: eventData.location ?? "",
          isExternal: Boolean(eventData.isExternal),
          externalUrl: eventData.externalUrl ?? "",
          format:
            (eventData.format as "PHYSICAL" | "ONLINE" | "HYBRID") ??
            "PHYSICAL",
          onlineUrl: eventData.onlineUrl ?? "",
          allowRsvp: Boolean(eventData.allowRsvp ?? true),
          allowMoments: Boolean(eventData.allowMoments ?? true),
          allowToasts: Boolean(eventData.allowToasts ?? true),
          eventTypeId: eventData.eventTypeId ?? "",
          templateId: eventData.templateId ?? "",
          isCustomTheme: Boolean(eventData.isCustomTheme),
          theme: parsedTheme || {
            primaryColor: "#09090b",
            backgroundColor: "#ffffff",
            borderRadius: "md",
          },
          enableTicketing: Boolean(eventData.ticketEvent),
          enableContributions: Boolean(eventData.thread),
          ticketingData: eventData.ticketEvent
            ? {
                tiers:
                  eventData.ticketEvent.tiers?.map((t) => ({
                    name: t.name,
                    price: t.price,
                    capacity: t.capacity,
                  })) ?? [],
              }
            : { tiers: [] },
          contributionsData: eventData.thread
            ? {
                items:
                  eventData.thread.items?.map((item) => ({
                    name: item.name,
                    price: item.price,
                    category: item.category,
                    image: item.imageUrl,
                  })) ?? [],
              }
            : { items: [] },
        }
      : undefined,
    [eventData, parsedTheme],
  );

  const methods = useForm<WizardFormValues>({
    resolver: zodResolver(eventWizardSchema),
    mode: "onChange",
    values: wizardValues,
  });

  // Live isExternal from the form — updates instantly on toggle
  const isExternal = methods.watch("isExternal");

  // Dynamic steps: hide ticketing/contributions for external events
  const WIZARD_STEPS = React.useMemo(() => {
    if (isExternal) {
      return ALL_WIZARD_STEPS.filter(
        (s) => s.id !== "ticketing" && s.id !== "contributions",
      );
    }
    return ALL_WIZARD_STEPS;
  }, [isExternal]);

  const currentStepIndex = WIZARD_STEPS.findIndex(
    (step) => step.id === currentStep,
  );
  const progressPercentage = Math.round(
    (currentStepIndex / (WIZARD_STEPS.length - 1)) * 100,
  );

  // Redirect away from hidden steps when isExternal toggles
  useEffect(() => {
    const hiddenSteps = ["ticketing", "contributions"];
    if (isExternal && hiddenSteps.includes(currentStep)) {
      router.replace("?step=review");
    }
  }, [isExternal, currentStep, router]);

  const handleSaveAndAdvance = async (nextStepId?: string) => {
    if (!eventId || eventId === "undefined") {
      console.error("Cannot update event: eventId is missing or invalid.");
      return;
    }

    // Gate navigation on the current step's required fields. This covers the
    // "Continue", "Skip to Launch", and forward sidebar-jump buttons so no
    // path can advance with an incorrect or incomplete form.
    const values = methods.getValues();
    let stepFields = STEP_VALIDATION[currentStep] ?? [];
    if (currentStep === "logistics") {
      if (values.format === "PHYSICAL" || values.format === "HYBRID") {
        stepFields = [...stepFields, "location"];
      }
      if (values.format === "ONLINE" || values.format === "HYBRID") {
        stepFields = [...stepFields, "onlineUrl"];
      }
      if (values.isExternal) {
        stepFields = [...stepFields, "externalUrl"];
      }
    }
    const isValid = await methods.trigger(stepFields);
    if (!isValid) {
      toast.error("Please fix the highlighted errors before continuing.");
      return;
    }

    try {
      setIsSaving(true);
      const {
        ticketingData,
        contributionsData,
        enableTicketing,
        enableContributions,
        theme,
        ...cleanPayload
      } = values;

      const formattedTheme =
        typeof theme === "object" && theme !== null
          ? JSON.stringify(theme)
          : theme;

      const sanitizedPayload = Object.fromEntries(
        Object.entries(cleanPayload).map(([key, value]) => [
          key,
          value === "" ? undefined : value,
        ]),
      );

      const payload = {
        ...sanitizedPayload,
        ...(formattedTheme !== undefined && { theme: formattedTheme }),
      };

      await updateEventApi(eventId, payload);

      const target = nextStepId ?? WIZARD_STEPS[currentStepIndex + 1]?.id;
      if (target) router.push(`?step=${target}`);
    } catch (error) {
      console.error("Failed to update event progress:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStepJump = async (stepId: string, targetIndex: number) => {
    if (targetIndex < currentStepIndex) {
      router.push(`?step=${stepId}`);
    } else {
      await handleSaveAndAdvance(stepId);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-32 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-100">
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight text-zinc-900">
              Event Setup
            </h1>
            <p className="text-sm text-zinc-500">
              Configure your event details
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-32 bg-zinc-100 h-2 rounded-full overflow-hidden hidden sm:block">
              <div
                className="bg-zinc-950 h-full transition-all duration-300 ease-in-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {progressPercentage >= 25 && currentStep !== "review" ? (
              <button
                type="button"
                onClick={() => handleSaveAndAdvance("review")}
                disabled={isSaving}
                className="text-xs font-bold text-white bg-zinc-950 hover:bg-zinc-800 border border-zinc-900 px-3 py-1.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                {isSaving ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <span>Skip to Launch</span>
                    <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1 py-0.5 rounded font-mono font-medium">
                      {progressPercentage}%
                    </span>
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            ) : (
              <span className="text-xs font-semibold text-zinc-500 font-mono bg-zinc-50 border border-zinc-200 px-2.5 py-1.5 rounded-xl">
                {progressPercentage}% Complete
              </span>
            )}
          </div>
        </div>

        {/* Layout Grid */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Roadmap */}
          <nav
            aria-label="Progress Roadmap"
            className="w-full h-full md:w-64 bg-white border-b border-zinc-100 md:border md:border-zinc-200/80 rounded-none md:rounded-2xl p-4 md:p-5 shadow-none md:shadow-sm sticky top-0 md:top-6 z-20"
          >
            <ol className="flex flex-row md:flex-col gap-6 md:gap-6 overflow-x-auto scrollbar-none pb-2 md:pb-0 relative min-w-full">
              <div
                className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-zinc-100 hidden md:block"
                aria-hidden="true"
              />

              {WIZARD_STEPS.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isActive = idx === currentStepIndex;

                return (
                  <li
                    key={step.id}
                    onClick={() => handleStepJump(step.id, idx)}
                    className="group flex flex-row items-center md:items-start gap-3 shrink-0 relative z-10 transition-all duration-200 cursor-pointer"
                  >
                    <div
                      className={`flex items-center justify-center h-8 w-8 rounded-full shrink-0 border text-xs font-mono font-bold transition-all duration-300 ${
                        isActive
                          ? "bg-zinc-950 border-zinc-950 text-white shadow-sm ring-4 ring-zinc-950/10"
                          : isCompleted
                            ? "bg-emerald-50 border-emerald-600 text-emerald-700 group-hover:bg-emerald-100"
                            : "bg-white border-zinc-200 text-zinc-400"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    <div className="flex flex-col justify-center min-w-0 md:pt-0.5">
                      <span
                        className={`shrink-0 text-xs font-semibold tracking-tight transition-colors duration-200 ${
                          isActive
                            ? "text-zinc-900 font-bold"
                            : isCompleted
                              ? "text-zinc-700 group-hover:text-zinc-950"
                              : "text-zinc-400"
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-medium hidden md:block leading-relaxed mt-0.5">
                        {step.description}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Step Form Container */}
          <main className="flex-1 w-full bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm min-w-0">
            {currentStep === "logistics" && (
              <StepLogistics
                onNext={handleSaveAndAdvance}
                isSaving={isSaving}
              />
            )}
            {currentStep === "branding" && (
              <StepBranding onNext={handleSaveAndAdvance} isSaving={isSaving} />
            )}
            {currentStep === "ticketing" && !isExternal && (
              <StepTicketing
                onNext={handleSaveAndAdvance}
                isSaving={isSaving}
                eventId={eventId}
              />
            )}
            {currentStep === "contributions" && !isExternal && (
              <StepContributions
                onNext={handleSaveAndAdvance}
                isSaving={isSaving}
              />
            )}
            {currentStep === "review" && eventData && <StepReview eventId={eventId} eventData={eventData} />}
          </main>
        </div>
      </div>
    </FormProvider>
  );
}
