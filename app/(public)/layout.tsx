import React from "react";
import { Navbar } from "@/components/layouts/navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="lg:min-h-screen bg-gradient-to-b from-[#f4fbf9] to-[#ffffff]">
      <Navbar />
      {children}
    </div>
  );
}