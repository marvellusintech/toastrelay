// app/(dashboard)/events/[eventId]/setup/_components/step-branding.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { type WizardFormValues } from "@/validations/event.schema";
import { Button } from "@/components/ui/button";

// Mock values - swap with production data arrays fetched from your backend
const EVENT_TYPES = [
  { id: "wedding", label: "Wedding / Reception" },
  { id: "corporate", label: "Corporate & Tech" },
  { id: "party", label: "Social & Party" },
];

const TEMPLATES = [
  { id: "tpl_minimal", name: "Clean Minimalist", type: "wedding" },
  { id: "tpl_dark", name: "Midnight Cyber", type: "corporate" },
  { id: "tpl_bold", name: "Vibrant Dynamic", type: "party" },
];

export function StepBranding() {
  const router = useRouter();
  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<WizardFormValues>();

  const selectedType = watch("eventTypeId");
  const isCustomTheme = watch("isCustomTheme");
  const currentTheme = watch("theme");

  const handleNext = async () => {
    const isValid = await trigger(["eventTypeId", "templateId"]);
    if (isValid) {
      router.push("?step=ticketing");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Visual Branding</h2>
        <p className="text-sm text-zinc-500">
          Pick the core engine layouts and configure custom colors.
        </p>
      </div>

      <div className="space-y-5">
        {/* Category Pick */}
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-2">
            Event Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {EVENT_TYPES.map((type) => (
              <label
                key={type.id}
                className={`flex items-center p-3 border rounded-xl cursor-pointer text-sm font-medium ${selectedType === type.id ? "border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950" : "hover:bg-zinc-50"}`}
              >
                <input
                  type="radio"
                  value={type.id}
                  {...register("eventTypeId")}
                  className="sr-only"
                />
                {type.label}
              </label>
            ))}
          </div>
          {errors.eventTypeId && (
            <p className="text-xs text-red-500 mt-1">
              {errors.eventTypeId.message}
            </p>
          )}
        </div>

        {/* Base Structural Template Layout Layout Selection */}
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-2">
            Base Layout Template
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEMPLATES.map((tpl) => (
              <label
                key={tpl.id}
                className="flex p-3 border rounded-xl cursor-pointer items-center justify-between hover:bg-zinc-50"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    value={tpl.id}
                    {...register("templateId")}
                    className="text-zinc-900 focus:ring-zinc-950"
                  />
                  <span className="text-sm font-medium text-zinc-800">
                    {tpl.name}
                  </span>
                </div>
              </label>
            ))}
          </div>
          {errors.templateId && (
            <p className="text-xs text-red-500 mt-1">
              {errors.templateId.message}
            </p>
          )}
        </div>

        {/* Custom JSON Object Override Controls */}
        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border mt-6">
          <div>
            <label className="text-sm font-medium text-zinc-800 block">
              Override Defaults with Custom Theme
            </label>
            <span className="text-xs text-zinc-500">
              Expose functional layout properties inside JSON block
            </span>
          </div>
          <input
            type="checkbox"
            {...register("isCustomTheme")}
            className="h-4 w-4 rounded text-zinc-900 border-zinc-300 focus:ring-zinc-950"
          />
        </div>

        {isCustomTheme && (
          <div className="p-4 border rounded-xl bg-zinc-50/50 space-y-4 animate-in slide-in-from-top-3 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase block mb-1">
                  Primary Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={currentTheme?.primaryColor}
                    onChange={(e) =>
                      setValue("theme.primaryColor", e.target.value)
                    }
                    className="w-10 h-10 border rounded-xl cursor-pointer p-0 overflow-hidden"
                  />
                  <input
                    type="text"
                    value={currentTheme?.primaryColor}
                    onChange={(e) =>
                      setValue("theme.primaryColor", e.target.value)
                    }
                    className="w-full text-sm px-3 border rounded-xl bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase block mb-1">
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={currentTheme?.backgroundColor}
                    onChange={(e) =>
                      setValue("theme.backgroundColor", e.target.value)
                    }
                    className="w-10 h-10 border rounded-xl cursor-pointer p-0 overflow-hidden"
                  />
                  <input
                    type="text"
                    value={currentTheme?.backgroundColor}
                    onChange={(e) =>
                      setValue("theme.backgroundColor", e.target.value)
                    }
                    className="w-full text-sm px-3 border rounded-xl bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase block mb-1">
                Corner Border Radius
              </label>
              <select
                value={currentTheme?.borderRadius}
                onChange={(e) => {
                  const value = e.target
                    .value as WizardFormValues["theme"]["borderRadius"];
                  setValue("theme.borderRadius", value, {
                    shouldValidate: true,
                  });
                }}
                className="w-full text-sm p-2.5 border rounded-xl bg-white"
              >
                <option value="none">Sharp Corners (0px)</option>
                <option value="sm">Subtle (4px)</option>
                <option value="md">Standard (8px)</option>
                <option value="lg">Soft Curvature (16px)</option>
                <option value="full">Pill / Stadium Rounded</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("?step=logistics")}
        >
          Back
        </Button>
        <Button type="button" variant="secondary" className="flex-1 lg:flex-initial" onClick={handleNext}>
          Continue to Tickets
        </Button>
      </div>
    </div>
  );
}
