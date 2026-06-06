import React from "react";
import { BrandTag } from "@/components/reuseables/brand_tag";
import { FeatureSection } from "@/components/reuseables/ecosystem_section";
export default function DefaultPage() {
  return (
    <main className="">
      <section className="relative overflow-hidden bg-white">
        <style
          dangerouslySetInnerHTML={{
            __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(10px); }
        }
        .animate-float-1 { animation: float 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-reverse 7s ease-in-out infinite; }
        .animate-float-3 { animation: float 5.5s ease-in-out infinite; }
        .animate-float-4 { animation: float-reverse 6.5s ease-in-out infinite; }
        .animate-float-5 { animation: float 8s ease-in-out infinite; }
      `,
          }}
        />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-[#2ae0bc]/10 blur-[160px] rounded-full" />
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-turquoise/10 blur-[160px] rounded-full" />
        </div>

        <div className="relative pt-20 md:pt-32 lg:pt-52 pb-0 text-center  z-10 flex flex-col items-center justify-center ">
          {/* Top Minimal Subtitle (Mirrors "PRIVATE MEMBERS CLUB" structural style) */}
          <span className="mb-4 text-[11px] font-bold tracking-[0.2em] text-[#199e84] uppercase">
            Create. Celebrate. Share.
          </span>

          {/* Main Headline (Structural layout inspired by "Private, not distant.") */}
          <h1 className="max-w-5xl text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Every Event Deserves A{" "}
            <span className="-mt-4 relative text-8xl font-semibold inline-block font-sans italic text-[#2ae0bc] lowercase tracking-tight px-0 py- rounded-xl">
              stage
            </span>
            <br />
          </h1>

          {/* <div className="mt-10 mb-20">
            <button className="rounded-full bg-white border border-gray-200 px-8 py-3 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 transition-all duration-200 ease-in-out">
              Explore the platform
            </button>
          </div> */}

<div className="flex flex-col sm:flex-row gap-4 mt-8 mb-20">
  <button className="px-6 py-3 rounded-xl bg-[#2ae0bc] text-black font-semibold">
    Create Event
  </button>

  <button className="px-6 py-3 rounded-xl border border-gray-300 text-gray-800 font-semibold">
    Discover Events
  </button>
</div>

          <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-2 items-end  px-4 md:px-0">
            {/* Far Left Column */}
            <div className=" animate-float-1 h-48 md:h-64 bg-gray-100 rounded-t-2xl overflow-hidden shadow-sm md:translate-y-12">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop"
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-300"
                alt="Event setup"
              />
            </div>

            {/* Mid-Left Column */}
            <div className="animate-float-2 h-64 md:h-80 bg-gray-100 rounded-t-2xl overflow-hidden shadow-md md:translate-y-6">
              <img
                src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=600&auto=format&fit=crop"
                className="w-full h-full object-cover"
                alt="Celebration"
              />
            </div>

            {/* Center Tall Column (Hero Image anchor point) */}
            <div className="animate-float-3 col-span-2 md:col-span-1 h-80 md:h-[350px] bg-gray-100 rounded-t-3xl overflow-hidden shadow-lg z-10">
              <img
                src="https://images.unsplash.com/photo-1563841930606-67e2bce48b78?q=80&w=600&auto=format&fit=crop"
                className="w-full h-full object-cover"
                alt="Main Event feature"
              />
            </div>

            {/* Mid-Right Column */}
            <div className="animate-float-4 h-64 md:h-80 bg-gray-100 rounded-t-2xl overflow-hidden shadow-md md:translate-y-6">
              <img
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600&auto=format&fit=crop"
                className="w-full h-full object-cover"
                alt="Social gathering"
              />
            </div>

            {/* Far Right Column */}
            <div className="animate-float-5 h-48 md:h-64 bg-gray-100 rounded-t-2xl overflow-hidden shadow-sm md:translate-y-12">
              <img
                src="https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=600&auto=format&fit=crop"
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-300"
                alt="Outdoor venue"
              />
            </div>
            <div className="absolute -bottom-2 left-0 right-0 h-28 bg-linear-to-t from-white via-white/80 to-transparent pointer-events-none z-20" />
          </div>
        </div>
      </section>
      <FeatureSection />
    </main>
  );
}
