import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Manrope, Montserrat, Newsreader } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteConfig } from "@/data/site";
import { socialImage } from "@/lib/metadata";

import "./globals.css";
import "@/styles/navigation.css";
import "@/styles/footer.css";

const displayFont = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const heroApparelFont = localFont({
  src: "../assets/fonts/private/appareldisplay-regular-webfont.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-hero-apparel",
  display: "swap",
  // Retain the original TTF's vertical metrics without changing purchased bytes.
  declarations: [
    { prop: "ascent-override", value: "103.7%" },
    { prop: "descent-override", value: "27.5%" },
    { prop: "line-gap-override", value: "0%" },
  ],
});

const heroHankenFont = Hanken_Grotesk({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  variable: "--font-hero-hanken",
  display: "swap",
});

const laptopTanHeadlineFont = localFont({
  src: "../assets/fonts/private/tan_-_headline-webfont.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-laptop-tan-headline",
  display: "swap",
  declarations: [
    { prop: "ascent-override", value: "103%" },
    { prop: "descent-override", value: "30.5%" },
    { prop: "line-gap-override", value: "0%" },
  ],
});

const laptopMontserratFont = localFont({
  src: "../assets/fonts/montserrat/Montserrat-Regular.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-laptop-montserrat",
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
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  icons: {
    icon: "/brand/mes-logo.svg",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_GB",
    images: [socialImage],
  },
  twitter: {
    card: "summary",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: socialImage.url, alt: socialImage.alt }],
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
      className={`${displayFont.variable} ${heroApparelFont.variable} ${heroHankenFont.variable} ${laptopTanHeadlineFont.variable} ${laptopMontserratFont.variable} ${bodyFont.variable} ${brandFont.variable} antialiased`}
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
