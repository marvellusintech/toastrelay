"use client";

import DiscoveryPage from "@/components/DiscoveryMasonry";
import LandingPage from "@/components/LandingPage";
import { useState } from "react";



export default function DefaultPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
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
