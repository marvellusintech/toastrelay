"use client";
import React from "react";

import {
  Globe,
  Users,
  Gift,
  TicketIcon,
  Camera,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { BrandTag } from "./brand_tag";

const features = [
  {
    name: "Stage",
    icon: Globe,
    copy: "Every event deserves a Stage.",
    description: "The event’s home. The story, invitations, and presence.",
  },
  {
    name: "RollCall",
    icon: Users,
    copy: "Know who’s coming. Instantly.",
    description: "Seamless guest presence and attendance management.",
  },
  {
    name: "Toast",
    icon: Gift,
    copy: "Send a Toast. Be part of the moment.",
    description:
      "Celebratory contributions. A meaningful way for guests to be part of your story.",
  },
  {
    name: "Pass",
    icon: TicketIcon,
    copy: "Your entry. Your moment.",
    description:
      "Gated access and digital ticketing. Ensure privacy or public reach.",
  },
  {
    name: "Moments",
    icon: Camera,
    copy: "Relive it. Together.",
    description: "Shared galleries where guests contribute to the memory.",
  },
  {
    name: "Circles",
    icon: ShieldCheck,
    copy: "Everyone has a place.",
    description: "Sophisticated roles and permissions for your event crew.",
  },
];

export const FeatureSection = () => (
  <div className="py-32 px-4 md:px-8 lg:max-w-7xl lg:mx-auto">
    <section >
      <div className="text-center mb-20">
        <h2 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3 text-inherit">
          The Ecosystem
        </h2>
        <p className="max-w-3xl mx-auto text-gray-500 md:text-xl">A cohesive suite of tools designed to handle the complexity of events, so you can focus on the celebration.</p>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2.5rem] bg-white border border-black/5 hover:border-turquoise/20 hover:shadow-2xl hover:shadow-turquoise/5 transition-all group"
            >
              <div className="w-14 h-14 bg-turquoise/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-sm">
                <feature.icon className="w-7 h-7 text-turquoise" />
              </div>
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-1 font-display">
                <BrandTag>{feature.name}</BrandTag>
              </h3>
              <p className="text-turquoise-dark text-sm font-bold mb-5 tracking-wide uppercase">
                {feature.copy}
              </p>
              <p className="text-black/50 leading-relaxed text-lg">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </div>
);
