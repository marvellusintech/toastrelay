// app/(dashboard)/events/[eventId]/setup/_components/step-contributions.tsx
'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { type WizardFormValues } from '@/validations/event.schema';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StepContributions() {
  const router = useRouter();
  const { register, watch, setValue, control } = useFormContext<WizardFormValues>();
  const enableContributions = watch('enableContributions');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contributionsData.items'
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Contribution Threads</h2>
          <p className="text-sm text-zinc-500">Enable uniform apparel selections, Aso-Ebi, or gifting pools.</p>
        </div>
        <input
          type="checkbox"
          checked={enableContributions}
          onChange={(e) => {
            setValue('enableContributions', e.target.checked);
            if (e.target.checked && fields.length === 0) {
              append({ name: 'Event Fabric Uniform', price: 50, category: 'Apparel', image: '/placeholder.jpg' });
            }
          }}
          className="h-5 w-5 rounded text-zinc-900 border-zinc-300 focus:ring-zinc-950"
        />
      </div>

      {enableContributions ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200 relative">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-3 right-3 p-1.5 text-zinc-400 hover:text-red-500 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-600">Item / Goal Title</label>
                    <input
                      type="text"
                      {...register(`contributionsData.items.${index}.name` as const)}
                      className="w-full text-sm mt-1 p-2 border rounded-lg bg-white"
                      placeholder="e.g., Groom Family Lace Fabric"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-600">Required Unit Pricing ($)</label>
                    <input
                      type="number"
                      {...register(`contributionsData.items.${index}.price` as const, { valueAsNumber: true })}
                      className="w-full text-sm mt-1 p-2 border rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-600">Category Tag</label>
                    <input
                      type="text"
                      {...register(`contributionsData.items.${index}.category` as const)}
                      className="w-full text-sm mt-1 p-2 border rounded-lg bg-white"
                      placeholder="Apparel, Cash Gift, Catering"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-600">Asset Cover Link</label>
                    <input
                      type="text"
                      {...register(`contributionsData.items.${index}.image` as const)}
                      className="w-full text-sm mt-1 p-2 border rounded-lg bg-white text-zinc-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => append({ name: '', price: 0, category: 'Gifts', image: '/placeholder.jpg' })}
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 border px-3 py-2 rounded-lg bg-white shadow-sm hover:bg-zinc-50"
          >
            <Plus className="h-3.5 w-3.5" /> Add Contribution Target
          </button>
        </div>
      ) : (
        <div className="p-8 text-center border-2 border-dashed rounded-2xl bg-zinc-50/50">
          <p className="text-sm text-zinc-400">Contribution matrix skipped. Marketplace features will remain hidden.</p>
        </div>
      )}

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" onClick={() => router.push('?step=ticketing')} variant="outline">
          Back
        </Button>
        <Button
        variant={"secondary"}
        className="flex-1 lg:flex-initial"
          type="button"
          onClick={() => router.push('?step=review')}
        >
          {enableContributions ? 'Save & Review' : 'Skip & Review'}
        </Button>
      </div>
    </div>
  );
}