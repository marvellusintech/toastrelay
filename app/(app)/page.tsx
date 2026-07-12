"use client";

import DiscoveryPage from "@/components/DiscoveryMasonry";
import LandingPage from "@/components/LandingPage";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useState } from "react";



export default function DefaultPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  return (
    <main>
     {isAuthenticated ? (
        <DiscoveryPage />
      ) : (
        <LandingPage />
      )}
    </main>
  );
}
