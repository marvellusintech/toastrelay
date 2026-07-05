"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hideNavbar = /^\/events\/[^/]+$/.test(pathname);

  if (hideNavbar) return null;

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 md:px-8">
        <Link href={"/"}>
          <div className="flex items-center gap-2">
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

            <span className="tracking-tighter font-display font-bold text-xl uppercase">
              Toastrelay
            </span>
          </div>
        </Link>
        <div className="flex gap-10">
          <div className="flex items-center gap-3">
            <Link href="/#features">
              <p className="font-medium">Features</p>
            </Link>
            <Link href={"/#pricing"}>
              <p className="font-medium ">Pricing</p>
            </Link>
            <Link href={"/"}>
              <p className="font-medium">Find Events</p>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href={"/login"}>
              <p className="font-medium">Log In</p>
            </Link>
            <Button
              variant={"secondary"}
              size={"sm"}
              className=" hover:scale-105"
              onClick={() => router.push("/create-account", { scroll: true })}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
