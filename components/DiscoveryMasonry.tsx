"use strict";

import React, { useState } from "react";
import { Search, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils"; // standard shadcn utility helper
import { mockEventsList, mockCurrentUser } from "@/lib/mock_data";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import Image from "next/image";

const CATEGORIES = [
  "All",
  "Today",
  "Vendors",
  "Festivals",
  "Weddings",
  "Concerts",
];

export default function DiscoveryMasonry() {
  const [activeCategory, setActiveCategory] = useState("All");

  // Splits your single array into 4 vertical column buckets to construct the gaps-free Pinterest Layout
  const columns: (typeof mockEventsList)[] = [[], [], [], []];
  mockEventsList.forEach((item, idx) => {
    columns[idx % 4].push(item);
  });

  return (
    <div className=" h-screen w-full bg-white  antialiased text-neutral-900">
      {/* --- MAIN MAIN BROWSE VIEWCONTAINER --- */}
      <main className="flex-1 px-2 lg:px-8 pt- pb-12">
        {/* --- TOP FIXED SEARCH BAR HEADER --- */}
        <div className="sticky top-0 z-20 px-2 bg-white pt-2  pb-2">
          <header className="flex items-center gap-4  py-5">
            <div className="relative flex flex-1 items-center">
              <Search className="absolute left-4 h-5 w-5 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search events, themes, or organizers..."
                className="w-full rounded-full bg-[#EBF0F3] py-3 pl-12 pr-4 text-[15px] font-normal outline-none transition focus:bg-[#E2E8F0] placeholder:text-neutral-500"
              />
            </div>
          </header>

          {/* --- SUB-NAVIGATION CATEGORY PILLS --- */}
          <section className="mt-4 flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition whitespace-nowrap",
                  activeCategory === cat
                    ? "bg-neutral-900 text-white"
                    : "bg-transparent text-neutral-800 hover:bg-neutral-100",
                )}
              >
                {cat}
              </button>
            ))}
          </section>
        </div>

        {/* --- MASONRY GRID SYSTEM --- */}
        {/* --- MASONRY GRID SYSTEM --- */}
        <section className="px-2 mt-4 columns-2 gap-4 md:columns-3 lg:columns-4 space-y-4">
          {mockEventsList.map((event, idx) => (
            <Card key={event.id} className="px-2 py-3 break-inside-avoid mb-4">
              <div className="group relative overflow-hidden rounded-xl lg:rounded-2xl cursor-pointer">
                {/* 1. Simplified Container: No forced aspect ratios or heights here anymore! */}
                <div className="relative w-full overflow-hidden rounded-xl lg:rounded-2xl bg-neutral-100">
                  <Image
                    src={event.coverImage || "/placeholder.jpg"}
                    alt={event.name || "Event image"}
                    // 2. Remove 'fill'. Instead, give Next.js placeholder dimensions so it compiles.
                    // Tailwind's 'w-full h-auto' will override these and scale the image to its natural proportions!
                    width={500}
                    height={500}
                    unoptimized
                    // 3. 'h-auto' allows the height to dynamically calculate based on the image's original aspect ratio
                    className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                    priority={idx < 4}
                  />

                  {/* Pinterest Overlay Layer */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-4 z-10">
                    <div className="flex justify-end">
                      <Button>View Event</Button>
                    </div>

                    <div className="flex items-center justify-between text-white">
                      <span className="text-xs font-medium tracking-wide bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                        {event.eventType?.icon} {event.eventType?.label}
                      </span>
                      <button className="rounded-full bg-white p-2 text-neutral-900 hover:bg-neutral-100 transition">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Lower Context Label Elements */}
                <div className="mt-2 lg:mt-4 px-1">
                  <h3 className="truncate text-sm md:text-base font-bold text-neutral-900 line-clamp-1 leading-tight">
                    {event.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5 truncate">
                    {event.location}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </section>


        {/* <section className="px-2 mt-4 columns-2 gap-4 md:columns-3 lg:columns-4 space-y-4">
          {mockEventsList.map((event, idx) => {
            // Generates alternating aspect ratios based on index for a true staggered masonry look
            const aspectClass = idx % 3 === 0 ? "aspect-[3/4]" : idx % 3 === 1 ? "aspect-square" : "aspect-[4/5]";

            return (
              <Card key={event.id} className="px-2 py-3 break-inside-avoid mb-4">
                <div className="group relative overflow-hidden rounded-xl lg:rounded-2xl cursor-pointer">
                  

                  <div className={cn("relative w-full overflow-hidden rounded-xl lg:rounded-2xl bg-neutral-100", aspectClass)}>
                    
                    <Image
                      src={event.coverImage || "/placeholder.jpg"}
                      alt={event.name || "Event image"}
                      unoptimized
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      priority={idx < 4}
                    />

                    <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-4 z-10">
                      <div className="flex justify-end">
                        <Button>View Event</Button>
                      </div>

                      <div className="flex items-center justify-between text-white">
                        <span className="text-xs font-medium tracking-wide bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                          {event.eventType?.icon} {event.eventType?.label}
                        </span>
                        <button className="rounded-full bg-white p-2 text-neutral-900 hover:bg-neutral-100 transition">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 lg:mt-4 px-1">
                    <h3 className="truncate text-sm md:text-base font-bold text-neutral-900 line-clamp-1 leading-tight">
                      {event.name}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5 truncate">
                      {event.location}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </section> */}
      </main>
    </div>
  );
}
