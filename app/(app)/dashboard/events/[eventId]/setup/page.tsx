// app/(dashboard)/events/[eventId]/setup/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';

import { eventWizardSchema, type WizardFormValues } from '@/validations/event.schema';
import { StepLogistics } from './_components/stepLogistics';
import { StepBranding } from './_components/stepBranding';
import { StepTicketing } from './_components/stepTicketing';
import { StepContributions } from './_components/stepContributions';
import { StepReview } from './_components/stepReview';

// Steps definition array for the progress tracker sequence
const WIZARD_STEPS = [
  { id: 'logistics', title: 'Logistics', description: 'Dates & Venues' },
  { id: 'branding', title: 'Branding', description: 'Themes & Layouts' },
  { id: 'ticketing', title: 'Ticketing', description: 'Access Allocation' },
  { id: 'contributions', title: 'Contributions', description: 'Gifts & Uniforms' },
  { id: 'review', title: 'Review & Launch', description: 'Final Checks' },
] as const;

interface PageProps {
  params: {
    eventId: string;
  };
}

export default function EventSetupWizardPage({ params }: PageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { eventId } = params;
  const currentStep = searchParams.get('step') || 'logistics';

  // Calculate matching structural indices for step metrics
  const currentStepIndex = WIZARD_STEPS.findIndex((step) => step.id === currentStep);
  const progressPercentage = Math.round((currentStepIndex / (WIZARD_STEPS.length - 1)) * 100);

  const methods = useForm<WizardFormValues>({
    resolver: zodResolver(eventWizardSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      slug: '',
      isExternal: false,
      isCustomTheme: false,
      theme: { primaryColor: '#09090b', backgroundColor: '#ffffff', borderRadius: 'md' },
      enableTicketing: false,
      enableContributions: false,
    },
  });

  // Allows instant navigation jump backwards to already completed steps
  const handleStepJump = (stepId: string, targetIndex: number) => {
    if (targetIndex < currentStepIndex) {
      router.push(`?step=${stepId}`);
    }
  };

  return (
<FormProvider {...methods}>
  <div className="max-w-6xl mx-auto px-4 pt-8 pb-32 space-y-8">
    
    {/* --- Header Context Layout Banner --- */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-100">
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight text-zinc-900">Event Setup</h1>
        <p className="text-sm text-zinc-500">
          Event name
          {/* <span className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-xs text-zinc-700">
            {eventId}
          </span> */}
        </p>
      </div>

<div className="flex items-center gap-4">
  {/* Progress Bar Track */}
  <div className="w-32 bg-zinc-100 h-2 rounded-full overflow-hidden hidden sm:block">
    <div
      className="bg-zinc-950 h-full transition-all duration-300 ease-in-out"
      style={{ width: `${progressPercentage}%` }}
    />
  </div>

  {/* Contextual Action Badge / Quick-Launch Trigger */}
  {progressPercentage >= 25 && currentStep !== 'review' ? (
    <button
      type="button"
      onClick={() => router.push('?step=review')}
      className="text-xs font-bold text-white bg-zinc-950 hover:bg-zinc-800 border border-zinc-900 px-3 py-1.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-200"
    >
      <span>Skip to Launch</span>
      <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1 py-0.5 rounded font-mono font-medium">
        {progressPercentage}%
      </span>
      <span aria-hidden="true">→</span>
    </button>
  ) : (
    <span className="text-xs font-semibold text-zinc-500 font-mono bg-zinc-50 border border-zinc-200 px-2.5 py-1.5 rounded-xl">
      {progressPercentage}% Complete
    </span>
  )}
</div>
    </div>

    {/* --- Responsive Sidebar + Main Content Layout Grid --- */}
    <div className="flex flex-col md:flex-row gap-8 ">
      
      {/* --- Dynamic Sidebar Navigation Roadbar --- */}
<nav 
  aria-label="Progress Roadmap" 
  // 1. Fixed "sticky top-6" for desktop, full-width with a lower border line on mobile
  className="w-full h-full md:w-64 bg-white border-b border-zinc-100 md:border md:border-zinc-200/80 rounded-none md:rounded-2xl p-4 md:p-5 shadow-none md:shadow-sm sticky top-0 md:top-6 z-20"
>
  {/* 2. Added overflow-x-auto, forced single line flex row on mobile, column on desktop */}
  <ol className="flex flex-row md:flex-col gap-6 md:gap-6 overflow-x-auto scrollbar-none pb-2 md:pb-0 relative min-w-full">
    
    {/* Vertical indicator connector line (Desktop only) */}
    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-zinc-100 hidden md:block" aria-hidden="true" />

    {WIZARD_STEPS.map((step, idx) => {
      const isCompleted = idx < currentStepIndex;
      const isActive = idx === currentStepIndex;

      return (
        <li
          key={step.id}
          onClick={() => handleStepJump(step.id, idx)}
          // 3. Changed layout structure to flex-row for horizontal clean line grouping on mobile
          className={`group flex flex-row items-center md:items-start gap-3 shrink-0 relative z-10 transition-all duration-200 ${
            isCompleted ? 'cursor-pointer' : ''
          }`}
        >
          {/* Status Indicator Icon Block */}
          <div 
            className={`flex items-center justify-center h-8 w-8 rounded-full shrink-0 border text-xs font-mono font-bold transition-all duration-300 ${
              isActive
                ? 'bg-zinc-950 border-zinc-950 text-white shadow-sm ring-4 ring-zinc-950/10'
                : isCompleted
                ? 'bg-emerald-50 border-emerald-600 text-emerald-700 group-hover:bg-emerald-100'
                : 'bg-white border-zinc-200 text-zinc-400'
            }`}
          >
            {isCompleted ? (
              <Check className="h-3.5 w-3.5 stroke-[3]" />
            ) : (
              <span>{idx + 1}</span>
            )}
          </div>

          {/* Text Metadata */}
          <div className="flex flex-col justify-center min-w-0 md:pt-0.5">
            <span 
              className={`shrink-0 text-xs font-semibold tracking-tight transition-colors duration-200 ${
                isActive 
                  ? 'text-zinc-900 font-bold' 
                  : isCompleted 
                  ? 'text-zinc-700 group-hover:text-zinc-950' 
                  : 'text-zinc-400'
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

      {/* --- Main Display Step Form Container --- */}
      <main className="flex-1 w-full bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm min-w-0">
        {currentStep === 'logistics' && <StepLogistics />}
        {currentStep === 'branding' && <StepBranding />}
        {currentStep === 'ticketing' && <StepTicketing />}
        {currentStep === 'contributions' && <StepContributions />}
        {currentStep === 'review' && <StepReview eventId={eventId} />}
      </main>

    </div>
  </div>
</FormProvider>
  );
}