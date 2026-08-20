"use client";

import React from "react";
import { FeatureSection } from "@/components/reuseables/ecosystem_section";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { ArrowRight } from "lucide-react";
import { Pricing } from "@/components/pricing";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();
  return (
    <main className="">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
        >
          <ContainerScroll
            titleComponent={
              <div className="space-y-6">
                <span className="mb-4 block text-[11px] font-bold font-display tracking-[0.2em] text-primary-550 uppercase">
                  Create. Celebrate. Share.
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-gray-900">
                  Every Event Deserves A <br />
                  <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-sans italic text-primary lowercase">
                    stage
                  </span>
                </h1>
                <div className="lg:mb-10 flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button
                    variant="secondary"
                    onClick={() => router.push("/dashboard/events/create")}
                  >
                    Create Event
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/discovery")}
                  >
                    Discover Events
                  </Button>
                </div>
              </div>
            }
          >
            <video
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
              autoPlay
              loop
              muted
              playsInline
              poster="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop"
              className="mx-auto rounded-2xl object-cover h-full w-full object-left-top"
            />
          </ContainerScroll>
        </motion.div>
      </AnimatePresence>

      {/* Discovery Section */}
      <section
        id="discovery-section"
        className="w-full py-16 md:pt-52 md:pb-32 px-4 md:px-24 bg-white border-b border-black/5"
      >
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Bold discovery narrative */}

            <div className="lg:col-span-6  text-left">
              <motion.div transition={{ duration: 0.2 }} className="space-y-4">
                <span className="inline-flex items-center text-xs font-bold uppercase tracking-[0.3em] text-primary-600 font-display">
                  Event Discovery
                </span>
                <h2 className="-ml-1 text-4xl md:text-5xl font-bold tracking-tight font-display uppercase text-black leading-none">
                  Discover What&apos;s Happening
                </h2>
                <div className="space-y-4">
                  <p className="text-base text-black/60 leading-relaxed font-body">
                    Not every event starts on ToastRelay. <br />
                    Some are created here. <br />
                    Others are discovered here.
                  </p>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <Button
                    onClick={() => router.push("/discovery")}
                    variant="secondary"
                  >
                    Explore Live Events <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Spotlight Hero image */}
            <div className="lg:col-span-6">
              <motion.div
                whileHover={{ y: -6 }}
                className="relative bg-[#FAF9F6] p-4 rounded-[3rem] border border-black/10 overflow-hidden shadow-2xl shadow-primary/5"
              >
                {/* Live/Trending Tag */}
                <div className="absolute top-8 left-8 z-20 bg-black text-white px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  Spotlight Event
                </div>

                {/* Image overlay with gorgeous gradient */}
                <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />
                  <img
                    src="/images/social-gathering-cover.jpg"
                    alt="Curated social gathering"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-turquoise">
                      Conservatory Gathering
                    </span>
                    <h3 className="text-xl md:text-2xl font-black font-display uppercase tracking-tight mt-1">
                      Glass Conservatory Gala Reception
                    </h3>
                  </div>
                </div>

                {/* Interactive simulation info */}
                <div className="flex items-center justify-between px-2 pb-2">
                  <div className="flex -space-x-3 overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                      <img
                        key={i}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                        src={`https://picsum.photos/seed/user-${i}/100/100`}
                        alt="Attendee"
                      />
                    ))}
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-black text-white ring-2 ring-white text-[9px] font-bold">
                      +42
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/40 block">
                      Live Attendees
                    </span>
                    <span className="text-xs font-mono font-bold text-black">
                      124 Attending Tonight
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 md:py-32 px-4 md:px-24 border-b border-black/5 relative overflow-hidden">
        <div className="relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-primary/5 blur-[80px] rounded-full pointer-events-none -translate-x-10" />
              <div className="relative flex flex-col gap-6 sm:flex-row lg:flex-col shrink-0">
                {/* Frame 1: Wedding */}
                <motion.div
                  whileHover={{ scale: 1.02, rotate: -1 }}
                  className="relative bg-[#FAF9F6] px-4 py-8 rounded-3xl border border-black/5 shadow-xl shadow-black/5 overflow-hidden w-full max-w-[360px] mx-auto sm:rotate-2 lg:rotate-3 lg:hover:-translate-y-2 transition-all"
                >
                  <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-black/5">
                    <img
                      src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=1200"
                      alt="Wedding Gathering "
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-black font-display">
                    <span>Chloe & James Wedding</span>
                    {/* <span className="text-[8px] tracking-normal font-mono bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">
                      Classic Wedding
                    </span> */}
                  </div>
                </motion.div>

                {/* Frame 2: Gala / Social Table */}
                <motion.div
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  className="relative bg-[#FAF9F6] px-4 py-8 rounded-3xl border border-black/5 shadow-2xl shadow-black/10 overflow-hidden w-full max-w-[360px] mx-auto -translate-y-4 sm:translate-y-6 lg:translate-y-0 sm:-rotate-2 lg:-rotate-2 lg:hover:-translate-y-2 transition-all lg:-mt-10 lg:ml-8"
                >
                  <div className="aspect-video rounded-2xl overflow-hidden mb-4 bg-black/5">
                    <img
                      src="/images/gala-cover.png"
                      alt="Gala Exhibition Stage"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-black font-display">
                    <span>Artistry Gala Night</span>
                    <span className="text-[8px] tracking-normal font-mono bg-turquoise/10 text-turquoise-dark px-2 py-0.5 rounded-full">
                      Exhibition
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="space-y-4">
                {/* <span className="mb-4 text-[11px] font-bold tracking-[0.2em] text-turquoise-dark uppercase">
             Loved by Creators
          </span> */}
                <span className="inline-flex items-center text-xs font-bold uppercase tracking-[0.3em] text-primary-600 font-display">
                  Loved by Organizers
                </span>
                <h2 className="-mx-1 text-4xl md:text-5xl font-bold tracking-tight font-display uppercase text-black leading-none">
                  More Than Event Management
                </h2>
                <div className="space-y-4">
                  <p className="text-lg text-black font-semibold font-body leading-tight">
                    Most platforms help you manage events. <br />
                    ToastRelay helps events exist.
                  </p>
                  <p className="text-base text-black/60 leading-relaxed font-body">
                    Whether you are hosting a wedding, organizing a conference,
                    launching a concert, or celebrating a milestone, every event
                    gets a home where people can discover it, join it, celebrate
                    it, and relive it.
                  </p>
                </div>
              </div>

              <div>
                {" "}
                <Button
                  variant="default"
                  onClick={() => router.push("/dashboard/events/create")}
                >
                  Create Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="pricing">
        <Pricing />
      </section>
      <section id="features">
        <FeatureSection />
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-36 bg-primary/5 px-6 relative overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight font-display uppercase text-black leading-none">
            Ready to Build <br /> Your Stage?
          </h2>
          <p className="text-base md:text-xl text-black/60 max-w-2xl mx-auto font-body leading-relaxed">
            Create a home for your next event and bring people together in one
            place.
          </p>

          <div className="pt-">
            <Button>
              <Link href="/dashboard/events/create">Create an Event</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
