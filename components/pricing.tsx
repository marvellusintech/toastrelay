import { Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./ui/button";

export function Pricing() {
  return (
    <div className="px-4 md:px-24 border-b bg-[#FAF9F6] ">
      {/* Pricing Section */}
      <div className="py-24 md:py-32  px-6  relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-24">
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="inline-flex items-center text-xs font-bold uppercase tracking-[0.3em] text-primary-600 bg-primary/5 px-4 py-1.5 rounded-full font-display">
              Simple Pricing
            </span>
            <h2 className="text-5xl font-bold tracking-tight font-display uppercase text-black leading-none">
              Plans Built for <br /> Celebrations
            </h2>
            <p className=" md:text-lg text-black/50 font-body max-w-lg mx-auto leading-relaxed mt-2">
              No monthly fees. Pay only for what you host. Always free for
              intimate events & casual gatherings.
            </p>
          </div>

          {/* Pricing Cards Grid */}
          <div className=" grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plan 1: Casual Stage */}
            <motion.div
              whileHover={{ y: -4 }}
              className="cursor-pointer bg-white border border-black/5 p-8 rounded-[2.5rem] flex flex-col justify-between text-left space-y-8 relative shadow-sm"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black/40">
                    Intimate Meetups
                  </span>
                  <h3 className="text-2xl font-black font-display uppercase text-black">
                    Casual Stage
                  </h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black font-display text-black">
                    $0
                  </span>
                  <span className="text-xs text-black/40 font-mono">
                    / free forever
                  </span>
                </div>
                <p className="text-xs text-black/50 leading-relaxed font-body">
                  Best for small family dinners, casual neighborhood cleanups,
                  or cozy apartment watch parties.
                </p>

                <div className="border-t border-black/5 pt-6 space-y-3.5 text-xs">
                  {[
                    "Live customizable Stage link",
                    "Up to 50 guests RSVP capacity",
                    "Interactive live Toast feed",
                    "Basic registry linking & cash pool",
                    "Universal mobile checklist",
                  ].map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 text-black/70"
                    >
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
              variant={"secondary"}
                // onClick={() => {
                //   if (user || isDemoMode) {
                //     setView('create-event');
                //   } else {
                //     document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
                //   }
                // }}
                >
                Launch Free Stage
              </Button>
            </motion.div>

            {/* Plan 2: Premium Stage */}
            <motion.div
              whileHover={{ y: -4 }}
              className="cursor-pointer bg-white border-2 border-primary shadow-xl shadow-primary/5 p-8 rounded-[2.5rem] flex flex-col justify-between text-left space-y-8 relative"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-black text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-md z-10">
                Most Popular
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600">
                    Elite Celebrations
                  </span>
                  <h3 className="text-2xl font-black font-display uppercase text-black">
                    Premium Stage
                  </h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black font-display text-black">
                    $29
                  </span>
                  <span className="text-xs text-black/40 ">/ single event</span>
                </div>
                <p className="text-xs text-black/50 leading-relaxed font-body">
                  The absolute perfect standard for classic weddings, high-end
                  gallery openings, formal anniversary galas, or concerts.
                </p>

                <div className="border-t border-black/5 pt-6 space-y-3.5 text-xs">
                  {[
                    "Everything in Casual Stage plan",
                    "Up to 500 guests capacity",
                    "Bespoke designs & brand accent colors",
                    "Interactive seating plan & circular tables",
                    "Guest group circular permissions",
                    "Fully secure registry with 0% Toast fee",
                    "Export RSVP database instantly (CSV)",
                    "Fast priority success support",
                  ].map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 text-black/70"
                    >
                      <Check className="w-4 h-4 text-primary-500 shrink-0" />
                      <span className="font-">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
              variant={"secondary"}
                // onClick={() => {
                //   if (user || isDemoMode) {
                //     setView('create-event');
                //   } else {
                //     document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' });
                //   }
                // }}
               >
                Get Premium Stage
              </Button>
            </motion.div>

            {/* Plan 3: Elite Circle */}
            <motion.div
              whileHover={{ y: -4 }}
              className="cursor-pointer bg-white border border-black/5 p-8 rounded-[2.5rem] flex flex-col justify-between text-left space-y-8 relative shadow-sm"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black/40">
                    Agencies & Festivals
                  </span>
                  <h3 className="text-2xl font-black font-display uppercase text-black">
                    Elite Circle
                  </h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black font-display text-black">
                    
                  </span>
                  <span className="text-xs text-black/40 font-mono">
                    / single event
                  </span>
                </div>
                <p className="text-xs text-black/50 leading-relaxed font-body">
                  Crafted for multi-day conferences, ticketed summer music
                  festivals, or wedding planner agencies managing multiple
                  clients.
                </p>

                <div className="border-t border-black/5 pt-6 space-y-3.5 text-xs">
                  {[
                    "Everything in Premium Stage plan",
                    "Unlimited guests RSVP & ticketing",
                    "Professional QR Code scanner staff mode",
                    "Tailored custom domain setup",
                    "Access controls & private stage gates",
                    "Direct WhatsApp RSVP bot integrations",
                    "Dedicated event manager advisor",
                  ].map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 text-black/70"
                    >
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
              variant={"secondary"}
                onClick={() => {
                  alert(
                    "Thank you! Our Elite Success Team has been notified. We will reach you via email.",
                  );
                }}
              >
                Bespoke Consultation
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
