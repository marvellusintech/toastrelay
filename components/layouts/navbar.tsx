"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/", label: "Find Events" },
];

function ToastrelayLogoIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 859 867"
    >
      <path
        fillRule="evenodd"
        fill="rgb(0, 0, 0)"
        d="M854.363,351.300 C680.101,355.561 548.211,457.780 427.319,322.050 C402.012,293.638 377.681,239.638 390.269,175.802 C398.068,117.308 405.870,58.797 413.669,0.304 C484.138,-1.459 592.187,13.495 624.266,47.103 C618.961,78.902 584.713,107.709 567.717,130.952 C528.071,186.196 488.414,241.456 448.768,296.700 C447.747,316.248 448.193,321.888 456.568,333.750 C459.818,335.050 463.069,336.350 466.318,337.650 C500.673,346.151 529.644,302.240 550.167,286.950 C614.510,238.206 678.872,189.447 743.215,140.702 C789.641,167.166 850.305,282.178 854.363,351.300 ZM0.274,386.399 C-1.107,323.152 24.620,264.236 49.023,222.601 C51.623,222.601 54.223,222.601 56.823,222.601 C77.616,241.093 222.695,350.461 245.971,341.550 C251.170,337.000 256.371,332.449 261.571,327.900 C261.681,250.434 147.663,192.355 127.022,127.052 C159.315,80.573 226.799,38.978 288.870,23.704 C297.948,177.379 362.861,288.632 230.371,374.699 C203.076,392.430 154.519,412.337 101.673,401.999 C67.876,396.799 34.070,391.599 0.274,386.399 ZM858.263,495.598 C855.444,583.542 803.896,660.524 760.765,712.045 C758.165,712.045 755.564,712.045 752.965,712.045 C696.122,665.061 632.989,622.941 569.667,583.347 C540.519,565.121 517.520,524.801 474.118,522.897 C466.969,529.397 459.818,535.898 452.668,542.397 C452.836,577.821 576.891,727.539 602.817,758.845 C615.815,773.793 628.818,788.746 641.816,803.694 C637.931,786.479 612.551,867.709 429.269,866.093 C418.870,802.400 408.468,738.688 398.069,674.996 C387.879,622.798 407.871,576.893 425.369,550.197 C520.457,405.124 683.008,494.275 858.263,495.598 ZM0.274,491.698 C51.396,484.284 83.940,479.539 121.172,472.198 C160.738,464.397 194.820,480.403 218.671,489.748 C356.626,543.796 322.770,692.952 304.470,846.593 C302.520,846.593 300.570,846.593 298.620,846.593 C255.370,832.310 146.798,786.985 138.722,745.195 C179.668,689.301 220.625,633.390 261.571,577.497 C273.836,558.450 267.778,534.293 247.921,526.797 C212.556,513.448 103.357,647.451 66.573,655.496 C43.101,660.629 1.041,527.652 0.274,491.698 Z"
      />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const hideNavbar = /^\/events\/[^/]+$/.test(pathname);

  if (hideNavbar) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none">
      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center justify-between px-4 py-4 w-full bg-white/90 backdrop-blur-md shadow-sm pointer-events-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2ae0bc] text-black">
            <ToastrelayLogoIcon className="w-5 h-5" />
          </div>
          <span className="tracking-tighter font-display font-bold text-xl uppercase text-neutral-900">
            Toastrelay
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 transition hover:bg-black/5"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop Dynamic Navbar */}
      <div className="hidden md:flex relative items-center justify-between w-full max-w-7xl mx-auto px-6 py-4">
        {/* Outer Left Logo */}
        <motion.div
          animate={{
            opacity: scrolled ? 0 : 1,
            y: scrolled ? -8 : 0,
            scale: scrolled ? 0.95 : 1,
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className={`pointer-events-auto ${scrolled ? "pointer-events-none" : ""}`}
        >
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2ae0bc] text-black shadow-sm">
              <ToastrelayLogoIcon className="w-5 h-5" />
            </div>
            <span className="tracking-tighter font-display font-bold text-xl uppercase text-neutral-900">
              Toastrelay
            </span>
          </Link>
        </motion.div>

        {/* Center Floating Pill Navigation */}
        <motion.div
          layout
          className={`fixed left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-auto ${
            scrolled
              ? "top-4 bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-lg rounded-2xl px-3 py-1.5"
              : "top-4 bg-white/90 backdrop-blur-sm border border-neutral-200/80 shadow-sm rounded-2xl px-6 py-2.5"
          }`}
        >
          <div className="flex items-center gap-5">
            {/* Left Badge inside pill (Visible on scroll) */}
            <AnimatePresence mode="wait">
              {scrolled && (
                <motion.div
                  initial={{ opacity: 0, width: 0, scale: 0.8 }}
                  animate={{ opacity: 1, width: "auto", scale: 1 }}
                  exit={{ opacity: 0, width: 0, scale: 0.8 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="flex items-center gap-3 overflow-hidden pr-1"
                >
                  <Link
                    href="/"
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2ae0bc] text-black shrink-0 hover:scale-105 transition-transform"
                  >
                    <ToastrelayLogoIcon className="w-4 h-4" />
                  </Link>
                  <div className="h-4 w-[1px] bg-neutral-200 shrink-0" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nav Links */}
            <div className="flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right CTA inside pill (Visible on scroll) */}
            <AnimatePresence mode="wait">
              {scrolled && (
                <motion.div
                  initial={{ opacity: 0, width: 0, scale: 0.8 }}
                  animate={{ opacity: 1, width: "auto", scale: 1 }}
                  exit={{ opacity: 0, width: 0, scale: 0.8 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden pl-1"
                >
                  <Button
                    variant="default"
                    size="sm"
                    className="rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs px-3.5 py-1.5 font-medium shadow-sm cursor-pointer whitespace-nowrap"
                    onClick={() => router.push("/create-account", { scroll: true })}
                  >
                    Get Started
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Outer Right Auth Actions */}
        <motion.div
          animate={{
            opacity: scrolled ? 0 : 1,
            y: scrolled ? -8 : 0,
            scale: scrolled ? 0.95 : 1,
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className={`flex items-center gap-4 pointer-events-auto ${scrolled ? "pointer-events-none" : ""}`}
        >
          <Link
            href="/login"
            className="text-sm font-medium text-neutral-700 hover:text-neutral-950 transition-colors"
          >
            Log In
          </Link>
          <Button
            variant="default"
            size="sm"
            className="rounded-full bg-neutral-900 text-white hover:bg-neutral-800 px-4 py-2 text-sm font-medium shadow-sm transition-transform hover:scale-105 flex items-center gap-1 cursor-pointer"
            onClick={() => router.push("/create-account", { scroll: true })}
          >
            <span>Get Started</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      {/* Mobile Menu Drawer */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="w-[82%] max-w-sm sm:max-w-sm">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <div className="flex flex-col gap-1 p-6">
            {NAV_LINKS.map((link) => (
              <SheetClose asChild key={link.label}>
                <Link
                  href={link.href}
                  className="rounded-xl px-3 py-3 text-base font-semibold text-neutral-800 transition hover:bg-black/5"
                >
                  {link.label}
                </Link>
              </SheetClose>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-3 p-6">
            <SheetClose asChild>
              <Link
                href="/login"
                className="rounded-xl px-3 py-3 text-center text-base font-semibold text-neutral-800 transition hover:bg-black/5"
              >
                Log In
              </Link>
            </SheetClose>
            <Button
              variant="default"
              size="lg"
              className="w-full rounded-xl bg-neutral-900 text-white hover:bg-neutral-800"
              onClick={() => {
                setMenuOpen(false);
                router.push("/create-account", { scroll: true });
              }}
            >
              Sign Up
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
