"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function Navbar() {
    const pathname = usePathname();

  const hideNavbar = /^\/events\/[^/]+$/.test(pathname);

  if (hideNavbar) return null;
  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 md:px-8">
      <div className="flex items-center gap-2">
        {/* Logo Icon */}
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2ae0bc] text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 21l8.982-8.983m-1.018-4.03 1.018-4.03L9 12.967l1.018 4.03Z"
            />
          </svg>
        </div>
        {/* Logo Text */}
        <span className="tracking-tighter font-display font-bold text-xl uppercase ">
          Toastrelay
        </span>
      </div>

      {/* Shadcn Button */}
      <Button 
        className="rounded-full  px-4 py-4 font-san text-sm font-semibold text-white transition-all hover:bg-black/80 hover:scale-105"
      >
        SIGN IN
      </Button>
    </header>
  );
}