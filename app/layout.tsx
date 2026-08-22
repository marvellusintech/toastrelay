import type { Metadata } from "next";

import { Providers } from "@/app/providers";

import "./globals.css";
import { Geist, Inter, Space_Grotesk, Syncopate } from "next/font/google";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { AuthEventListener } from "@/components/AuthEventListener";

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
  metadataBase: new URL("https://toastrelay.com"),
  title: "Toastrelay",
  description:
    "Discover events, create event pages, manage guests, collect RSVPs, sell tickets, and bring your event experience together in one place.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Toastrelay — Every Event Deserves a Stage",
    description:
      "Discover events, create event pages, manage guests, collect RSVPs, sell tickets, and bring your event experience together in one place.",
    url: "https://toastrelay.com",
    siteName: "Toastrelay",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Toastrelay",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toastrelay — Every Event Deserves a Stage",
    description:
      "Discover events, create event pages, manage guests, collect RSVPs, sell tickets, and bring your event experience together in one place.",
    images: ["/og-image.png"],
  },
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
        spaceGrotesk.variable,
      )}
    >
      <body className="min-h-full bg-background text-foreground">
        <AuthEventListener>
          <Providers>{children}</Providers>
        </AuthEventListener>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
