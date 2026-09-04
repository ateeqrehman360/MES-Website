import type { Metadata, Viewport } from "next";
import { Manrope, Montserrat, Newsreader } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/data/site";

import "./globals.css";
import "@/styles/navigation.css";
import "@/styles/footer.css";

const displayFont = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const heroApparelFont = localFont({
  src: "../assets/fonts/Apparel Display Regular/Apparel Display Regular.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-hero-apparel",
  display: "swap",
});

const heroKommonFont = localFont({
  src: "../assets/fonts/kommon-grotesk-regular/kommon-grotesk-regular.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-hero-kommon",
  display: "swap",
});

const bodyFont = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const brandFont = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/brand/mes-logo.svg",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#EAE2D4",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en-GB"
      data-scroll-behavior="smooth"
      className={`${displayFont.variable} ${heroApparelFont.variable} ${heroKommonFont.variable} ${bodyFont.variable} ${brandFont.variable} antialiased`}
    >
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
