import type { Route } from "next";

import { navigationItems } from "@/data/site";

type FooterNavigationItem = {
  label: string;
  href: Route;
};

type FooterExternalLink = {
  label: string;
  href: string;
};

export type FooterSocialIcon =
  | "instagram"
  | "tiktok"
  | "linkedin"
  | "facebook";

type FooterSocialLink = FooterExternalLink & {
  icon: FooterSocialIcon;
};

export const footerNavigationItems = [
  ...navigationItems,
  { label: "Privacy", href: "/privacy" },
] satisfies readonly FooterNavigationItem[];

export const footerSocialLinks = [
  {
    label: "Instagram",
    icon: "instagram",
    href: "https://www.instagram.com/mmu.mes",
  },
  {
    label: "TikTok",
    icon: "tiktok",
    href: "https://www.tiktok.com/@mmu.mes",
  },
  {
    label: "LinkedIn",
    icon: "linkedin",
    href: "https://www.linkedin.com/company/muslimentrepreneurs",
  },
  {
    label: "Facebook",
    icon: "facebook",
    href: "https://www.facebook.com/people/Muslims-Entrepreneurs-Manchester/61588418034482/",
  },
] satisfies readonly FooterSocialLink[];

export const footerCommunityLinks = [
  {
    label: "Brothers WhatsApp",
    href: "https://chat.whatsapp.com/LN5moVwtJZADmKr7ijBiNH",
  },
  {
    label: "Sisters WhatsApp",
    href: "https://chat.whatsapp.com/Bupi8tfkIyc3GCqyHbwADU",
  },
] satisfies readonly FooterExternalLink[];
