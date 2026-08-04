"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Menu, X } from "lucide-react";
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

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const hideNavbar = /^\/events\/[^/]+$/.test(pathname);

  if (hideNavbar) return null;

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-white/90 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:px-8 md:py-6">
        <Link href={"/"}>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2ae0bc] text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                className="w-5 h-5"
                viewBox="0 0 859 867"
              >
                <path
                  fillRule="evenodd"
                  fill="rgb(0, 0, 0)"
                  d="M854.363,351.300 C680.101,355.561 548.211,457.780 427.319,322.050 C402.012,293.638 377.681,239.638 390.269,175.802 C398.068,117.308 405.870,58.797 413.669,0.304 C484.138,-1.459 592.187,13.495 624.266,47.103 C618.961,78.902 584.713,107.709 567.717,130.952 C528.071,186.196 488.414,241.456 448.768,296.700 C447.747,316.248 448.193,321.888 456.568,333.750 C459.818,335.050 463.069,336.350 466.318,337.650 C500.673,346.151 529.644,302.240 550.167,286.950 C614.510,238.206 678.872,189.447 743.215,140.702 C789.641,167.166 850.305,282.178 854.363,351.300 ZM0.274,386.399 C-1.107,323.152 24.620,264.236 49.023,222.601 C51.623,222.601 54.223,222.601 56.823,222.601 C77.616,241.093 222.695,350.461 245.971,341.550 C251.170,337.000 256.371,332.449 261.571,327.900 C261.681,250.434 147.663,192.355 127.022,127.052 C159.315,80.573 226.799,38.978 288.870,23.704 C297.948,177.379 362.861,288.632 230.371,374.699 C203.076,392.430 154.519,412.337 101.673,401.999 C67.876,396.799 34.070,391.599 0.274,386.399 ZM858.263,495.598 C855.444,583.542 803.896,660.524 760.765,712.045 C758.165,712.045 755.564,712.045 752.965,712.045 C696.122,665.061 632.989,622.941 569.667,583.347 C540.519,565.121 517.520,524.801 474.118,522.897 C466.969,529.397 459.818,535.898 452.668,542.397 C452.836,577.821 576.891,727.539 602.817,758.845 C615.815,773.793 628.818,788.746 641.816,803.694 C637.931,786.479 612.551,867.709 429.269,866.093 C418.870,802.400 408.468,738.688 398.069,674.996 C387.879,622.798 407.871,576.893 425.369,550.197 C520.457,405.124 683.008,494.275 858.263,495.598 ZM0.274,491.698 C51.396,484.284 83.940,479.539 121.172,472.198 C160.738,464.397 194.820,480.403 218.671,489.748 C356.626,543.796 322.770,692.952 304.470,846.593 C302.520,846.593 300.570,846.593 298.620,846.593 C255.370,832.310 146.798,786.985 138.722,745.195 C179.668,689.301 220.625,633.390 261.571,577.497 C273.836,558.450 267.778,534.293 247.921,526.797 C212.556,513.448 103.357,647.451 66.573,655.496 C43.101,660.629 1.041,527.652 0.274,491.698 Z"
                />
              </svg>
            </div>

            <span className="tracking-tighter font-display font-bold text-xl uppercase">
              Toastrelay
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-10 md:flex">
          <div className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href}>
                <p className="font-medium">{link.label}</p>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href={"/login"}>
              <p className="font-medium">Log In</p>
            </Link>
            <Button
              variant={"secondary"}
              size={"sm"}
              className="hover:scale-105"
              onClick={() => router.push("/create-account", { scroll: true })}
            >
              Sign Up
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-800 transition hover:bg-black/5 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
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
                href={"/login"}
                className="rounded-xl px-3 py-3 text-center text-base font-semibold text-neutral-800 transition hover:bg-black/5"
              >
                Log In
              </Link>
            </SheetClose>
            <Button
              variant={"secondary"}
              size={"lg"}
              className="w-full"
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
