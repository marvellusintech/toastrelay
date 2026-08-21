import { Check } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import Link from "next/link";

export function Pricing() {
  const freeFeatures = [
    "Unlimited events",
    "Customizable Event Pages",
    "RSVP & guest management",
    "Event discovery",
    "50 MB storage included",
    "100 emails included",
    "Event management tools",
    "Basic analytics",
  ];

  const payAsYouUse = [
    ["Storage", "From ₦300 / GB / month"],
    ["Email", "₦4 / email"],
    // ["SMS", "₦2 / SMS"],
    ["Tickets", "5% + ₦100 / ticket"],
    ["Toasts", "3%"],
    ["Contributions", "2%"],
  ];

  const customFeatures = [
    "Custom event requirements",
    "Custom domain assistance",
    "Special event setups",
    "Custom integrations",
    "Large or complex events",
    "Dedicated support",
  ];

  return (
    <div className="px-4 md:px-24 border-b bg-[#FAF9F6]">
      <div className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-20">
          {/* Header */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="inline-flex items-center text-xs font-bold uppercase tracking-[0.3em] text-primary-600 bg-primary/5 px-4 py-1.5 rounded-full font-display">
              Simple Pricing
            </span>

            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight font-display uppercase text-black leading-none">
              Built for Celebrations
            </h2>

            <p className="md:text-lg text-black/50 font-body max-w-xl mx-auto leading-relaxed mt-2">
              Create for free. Pay only when you need more
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white border border-black/5 p-8 rounded-[2.5rem] flex flex-col justify-between text-left space-y-8 relative shadow-sm"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black/40">
                    Start here
                  </span>

                  <h3 className="text-2xl font-black font-display uppercase text-black">
                    Free
                  </h3>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-body text-black">
                    ₦0
                  </span>

                  <span className="text-xs text-black/40 font-mono">
                    / forever
                  </span>
                </div>

                <p className="text-xs text-black/50 leading-relaxed font-body">
                  Everything you need to create, customize, and manage your
                  event without a subscription.
                </p>

                <div className="border-t border-black/5 pt-6 space-y-3.5 text-xs">
                  {freeFeatures.map((feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-2.5 text-black/70"
                    >
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="secondary"><Link href="/dashboard/events/create">Get started</Link></Button>
            </motion.div>

            {/* Pay As You Use */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white border-2 border-primary shadow-xl shadow-primary/5 p-8 rounded-[2.5rem] flex flex-col justify-between text-left space-y-8 relative"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary t text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-md z-10">
                Most Popular
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600">
                    Pay as You Use
                  </span>

                  {/* <h3 className="text-2xl font-black font-display uppercase text-black">
                    Pay as You Use
                  </h3> */}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-body text-black">
                    Usage-based
                  </span>
                </div>

                <p className="text-xs text-black/50 leading-relaxed font-body">
                  Add resources and use paid event features only when your event
                  needs them.
                </p>

                <div className="border-t border-black/5 pt-6 space-y-3.5 text-xs">
                  {payAsYouUse.map(([name, price]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between gap-4 text-black/70"
                    >
                      <span>{name}</span>

                      <span className="font-semibold text-black whitespace-nowrap">
                        {price}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-black/5 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-black/50">Credit value</span>

                    <span className="text-sm font-bold text-black">
                      1 credit = ₦1
                    </span>
                  </div>
                </div>
              </div>

              <Button variant="secondary" asChild>
                <Link href="/dashboard/events/create">Create an Event</Link>
              </Button>
            </motion.div>

            {/* Custom */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white border border-black/5 p-8 rounded-[2.5rem] flex flex-col justify-between text-left space-y-8 relative shadow-sm"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black/40">
                    Tailored to you
                  </span>

                  {/* <h3 className="text-2xl font-black font-display uppercase text-black">
                    Custom
                  </h3> */}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-body text-black">
                    Let&apos;s talk
                  </span>
                </div>

                <p className="text-xs text-black/50 leading-relaxed font-body">
                  Planning something that needs more than the standard
                  Toastrelay experience? Talk to our team.
                </p>

                <div className="border-t border-black/5 pt-6 space-y-3.5 text-xs">
                  {customFeatures.map((feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-2.5 text-black/70"
                    >
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="secondary" asChild>
                <a href="mailto:support@toastrelay.com?subject=Tailored%20Event%20Requirements">
                  Talk to Us
                </a>
              </Button>
            </motion.div>
          </div>

          {/* Footer Note */}
          {/* <div className="max-w-2xl mx-auto -mt-8">
            <p className="text-xs text-black/40 font-body leading-relaxed">
              No monthly subscription. Create your event for free and only pay
              for additional resources or paid features when you use them.
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
