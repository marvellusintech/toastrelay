import React from "react";
import { BrandTag } from "@/components/reuseables/brand_tag";
export default function HomePage() {
  return (
    <main className="px-4 lg:mx-auto flex lg:max-w-5xl flex-col items-center justify-center px-6 pt-20 pb-16 text-center md:pt-32">
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                  <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-turquoise/10 blur-[160px] rounded-full" />
                </div>
      {/* Launching Badge */}
      <div className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-[#2ae0bc]/40 bg-[#e8fbf7] px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-[#199e84] uppercase">
        Launching Globally
      </div>

      {/* Main Headline */}
      <h1 className="max-w-4xl  ">
        Every Event <br /> Deserves A <br />
        <span className="relative font-semibold inline-block font-sans italic text-[#2ae0bc] tracking-normal lowercase sm:text-7xl md:text-8xl ">
          stage
        </span>
      </h1>

      {/* Subtitle */}
      <p className="font-body mt-10 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
        The full-scale celebration platform that puts the host first.
        <br className="hidden sm:inline" /> Personalize your story, manage
        your circle, and relive every moment.
      </p>
    </main>
  );
}