// app/(dashboard)/events/[eventId]/setup/_components/step-ticketing.tsx
"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { type WizardFormValues } from "@/validations/event.schema";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StepTicketing() {
  const router = useRouter();
  const { register, watch, setValue, control } =
    useFormContext<WizardFormValues>();
  const enableTicketing = watch("enableTicketing");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ticketingData.tiers",
  });

  const handleNext = () => {
    router.push("?step=contributions");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Ticketing Access</h2>
          <p className="text-sm text-zinc-500">
            Sell tier allocations or track simple registration attendance.
          </p>
        </div>
        <input
          type="checkbox"
          checked={enableTicketing}
          onChange={(e) => {
            setValue("enableTicketing", e.target.checked);
            if (e.target.checked && fields.length === 0) {
              append({ name: "General Admission", price: 0, capacity: 100 });
            }
          }}
          className="h-5 w-5 rounded text-zinc-900 border-zinc-300 focus:ring-zinc-950"
        />
      </div>

      {enableTicketing ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex gap-2 items-end bg-zinc-50 p-3 rounded-xl border border-zinc-200"
              >
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">
                    Tier Name
                  </label>
                  <input
                    type="text"
                    {...register(`ticketingData.tiers.${index}.name` as const)}
                    className="w-full text-sm mt-1 p-2 border rounded-lg bg-white"
                    placeholder="VIP, Early Access"
                  />
                </div>
                <div className="w-20">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    {...register(
                      `ticketingData.tiers.${index}.price` as const,
                      { valueAsNumber: true },
                    )}
                    className="w-full text-sm mt-1 p-2 border rounded-lg bg-white"
                  />
                </div>
                <div className="w-20">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">
                    Qty
                  </label>
                  <input
                    type="number"
                    {...register(
                      `ticketingData.tiers.${index}.capacity` as const,
                      { valueAsNumber: true },
                    )}
                    className="w-full text-sm mt-1 p-2 border rounded-lg bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg mb-0.5"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => append({ name: "", price: 0, capacity: 50 })}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 border px-3 py-2 rounded-lg bg-white shadow-sm hover:bg-zinc-50"
          >
            <Plus className="h-3.5 w-3.5" /> Add Custom Access Tier
          </button>
        </div>
      ) : (
        <div className="p-8 text-center border-2 border-dashed rounded-2xl bg-zinc-50/50">
          <p className="text-sm text-zinc-400">
            Ticketing module skipped. Guests can browse detail sheets freely.
          </p>
        </div>
      )}

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button
          type="button"
          onClick={() => router.push("?step=branding")}
          variant="outline"
        >
          Back
        </Button>
        <Button type="button" onClick={handleNext} variant="secondary" className="flex-1 lg:flex-initial">
          {enableTicketing ? "Save & Continue" : "Skip & Continue"}
        </Button>
      </div>
    </div>
  );
}
