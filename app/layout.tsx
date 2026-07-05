import type { Metadata } from "next";

import { Providers } from "@/app/providers";

import "./globals.css";
import { Geist, Inter, Space_Grotesk, Syncopate } from "next/font/google";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { Navbar } from "@/components/layouts/navbar";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const syncopate = Syncopate({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});
export const metadata: Metadata = {
  title: "ToastRelay",
  description:
    "The frontend for event stages, guest presence, toasts, moments, and passes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        "font-sans",
        inter.variable,
        syncopate.variable,
        inter.variable,
        spaceGrotesk.variable,
      )}
    >
      <body className="min-h-full  bg-background text-foreground">

     
        <Providers>{children}</Providers>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
