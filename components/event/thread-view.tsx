"use client";

import React, { useState } from "react";
import { ShoppingBag, CreditCard, ShieldCheck } from "lucide-react";
import { BrandTag } from "@/components/reuseables/brand_tag";
import { Thread, ThreadItem, User } from "@/lib/types/response";
import { ThreadItemStatus } from "@/lib/types/enum";

interface ThreadViewProps {
  thread: Thread;
  user: User | null;
  hasAccess: boolean;
  onPurchase: (item: ThreadItem) => void;
}

export const ThreadView = ({
  thread,
  hasAccess,
  onPurchase,
}: ThreadViewProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    "all",
    ...Array.from(new Set(thread.items.map((i) => i.category))),
  ];

  // Access Denied Screen (Inherits base current text and layout structure colors)
  if (!hasAccess) {
    return (
      <div className="py-20 text-center rounded-[3rem] border-2 border-dashed border-current/10 bg-current/[0.03] p-8">
        <ShieldCheck className="w-16 h-16 opacity-20 mx-auto mb-6" />
        <h3 className="text-2xl font-bold uppercase tracking-tight mb-2 text-inherit">
          Circle-Only Thread
        </h3>
        <p className="opacity-50 max-w-md mx-auto text-sm">
          This Thread is exclusive to Circle members. Please contact the host
          for access.
        </p>
      </div>
    );
  }

  const filteredItems =
    selectedCategory === "all"
      ? thread.items
      : thread.items.filter((i) => i.category === selectedCategory);

  return (
    <div className="space-y-12 text-inherit" >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold uppercase tracking-tighter mb-2 flex items-center gap-3 text-inherit">
            {/* Inherits dynamic theme template color token */}
            <ShoppingBag
              className="w-8 h-8"
              style={{ color: "var(--theme-primary)" }}
            />
            <BrandTag>Thread</BrandTag>
          </h2>
          <p className="opacity-50 text-xs font-semibold uppercase tracking-widest">
            {thread.accessType ? thread.accessType.name : "Open Access"} •{" "}
            {thread.items.length} Items Available
          </p>
        </div>

        {/* Dynamic Navigation Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border border-current/10"
                style={{
                  backgroundColor: isSelected
                    ? "var(--theme-primary)"
                    : "transparent",
                  color: isSelected ? "#000000" : "inherit",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Interactive Items */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => {
          const isSoldOut = item.status === ThreadItemStatus.SOLD_OUT;

          return (
            <div
              key={item.id}
              className="rounded-[2.5rem] border border-current/10 bg-current/[0.02] backdrop-blur-sm overflow-hidden group hover:shadow-2xl transition-all duration-300"
            >
              {/* Product Media Canvas */}
              <div className="aspect-[4/5] relative overflow-hidden bg-current/[0.05]">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute top-6 left-6">
                  <span className="bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Card Meta Content Details Block */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-4 gap-2">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-inherit line-clamp-1">
                    {item.name}
                  </h3>
                  <span
                    className="text-lg font-black tracking-tight"
                    style={{ color: "var(--theme-primary)" }}
                  >
                    ${item.price}
                  </span>
                </div>

                <p className="opacity-50 text-sm mb-8 line-clamp-2">
                  {item.description}
                </p>

                <button
                  disabled={isSoldOut}
                  onClick={() => onPurchase(item)}
                  className="w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 border border-current/20 hover:border-transparent"
                  style={{
                    backgroundColor: isSoldOut
                      ? "rgba(var(--theme-primary), 0.1)"
                      : "var(--theme-primary)",
                    color: isSoldOut ? "rgba(252,252,252,0.3)" : "#000000",
                    opacity: isSoldOut ? 0.4 : 1,
                  }}
                >
                  {isSoldOut ? (
                    "Sold Out"
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" /> Purchase Item
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
