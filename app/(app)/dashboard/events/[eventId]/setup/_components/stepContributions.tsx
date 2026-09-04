// app/(dashboard)/events/[eventId]/setup/_components/step-contributions.tsx
"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { type WizardFormValues } from "@/validations/event.schema";
import { Loader2, Plus, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { usePayoutAccountGuard } from "@/lib/hooks/use-payout-account-guard";

interface StepProps {
  onNext: () => Promise<void>;
  isSaving: boolean;
  eventId: string;
}
export function StepContributions({ onNext, isSaving, eventId }: StepProps) {
  const router = useRouter();
  const { register, watch, setValue, control, getValues } =
    useFormContext<WizardFormValues>();
  const { ensurePayoutAccount } = usePayoutAccountGuard();
  const enableContributions = watch("enableContributions");
  const allowToasts = watch("allowToasts");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contributionsData.items",
  });

  const handleSubmit = async () => {
    const items = getValues("contributionsData.items");
    const hasPaidContribution = (items ?? []).some(
      (item) => Number(item.price) > 0,
    );
    if (
      !(await ensurePayoutAccount(hasPaidContribution, () => {
        sessionStorage.setItem(
          `event-setup-payment-draft:${eventId}`,
          JSON.stringify({
            enableContributions: getValues("enableContributions"),
            contributionsData: getValues("contributionsData"),
          }),
        );
      }))
    ) {
      return;
    }

    await onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">
            Contribution & Threads
          </h2>
          <p className="text-sm text-zinc-500">
            Enable uniform apparel selections, Aso-Ebi, or gifting pools.
          </p>
        </div>
        {/* <input
          type="checkbox"
          checked={enableContributions}
          onChange={(e) => {
            setValue("enableContributions", e.target.checked);
            if (e.target.checked && fields.length === 0) {
              append({
                name: "Event Fabric Uniform",
                price: 50,
                category: "Apparel",
                image: "/placeholder.jpg",
              });
            }
          }}
          className="h-5 w-5 rounded text-zinc-900 border-zinc-300 focus:ring-zinc-950"
        /> */}
      </div>



      {enableContributions ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200 relative"
              >
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-3 right-3 p-1.5 text-zinc-400 hover:text-red-500 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-600">
                      Item / Goal Title
                    </label>
                    <input
                      type="text"
                      {...register(
                        `contributionsData.items.${index}.name` as const,
                      )}
                      className="w-full text-sm mt-1 p-2 border rounded-lg bg-white"
                      placeholder="e.g., Groom Family Lace Fabric"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-600">
                      Required Unit Pricing ($)
                    </label>
                    <input
                      type="number"
                      {...register(
                        `contributionsData.items.${index}.price` as const,
                        { valueAsNumber: true },
                      )}
                      className="w-full text-sm mt-1 p-2 border rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-600">
                      Category Tag
                    </label>
                    <input
                      type="text"
                      {...register(
                        `contributionsData.items.${index}.category` as const,
                      )}
                      className="w-full text-sm mt-1 p-2 border rounded-lg bg-white"
                      placeholder="Apparel, Cash Gift, Catering"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-600">
                      Asset Cover Link
                    </label>
                    <input
                      type="text"
                      {...register(
                        `contributionsData.items.${index}.image` as const,
                      )}
                      className="w-full text-sm mt-1 p-2 border rounded-lg bg-white text-zinc-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              append({
                name: "",
                price: 0,
                category: "Gifts",
                image: "/placeholder.jpg",
              })
            }
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 border px-3 py-2 rounded-lg bg-white shadow-sm hover:bg-zinc-50"
          >
            <Plus className="h-3.5 w-3.5" /> Add Contribution Target
          </button>
        </div>
      ) : (
       <div>
          {/* <div className="p-8 text-center border-2 border-dashed rounded-2xl bg-zinc-50/50">
           <p className="text-sm text-zinc-400">
             Contribution matrix skipped. Marketplace features will remain
             hidden.
           </p>
         </div> */}
       </div>
      )}

            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4 text-zinc-600" />
            <label className="text-sm font-medium text-zinc-800">
              Allow Toasts &amp; Gifts
            </label>
          </div>
          <span className="text-xs text-zinc-500">
            Guests can send toast messages with optional cash gifts
          </span>
        </div>
        <Switch
          checked={allowToasts}
          onCheckedChange={(checked) => setValue("allowToasts", checked)}
        />
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button
          type="button"
          onClick={() => router.push("?step=ticketing")}
          variant="outline"
        >
          Back
        </Button>
        <Button
          variant={"secondary"}
          className="flex-1 lg:flex-initial"
          type="button"
          onClick={handleSubmit}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : enableContributions || allowToasts ? (
            "Save & Review"
          ) : (
            "Skip & Review"
          )}
        </Button>
      </div>
    </div>
  );
}
