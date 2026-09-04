import type { Route } from "next";

export const siteConfig = {
  name: "Muslim Entrepreneurs",
  shortName: "MES",
  description:
    "The Muslim Entrepreneurs society at Manchester Metropolitan University.",
  email: "mmu.mes@outlook.com",
} as const;

type NavigationItem = {
  label: string;
  href: Route;
};

export const primaryNavigationItems = [
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
] satisfies readonly NavigationItem[];

export const navigationItems = [
  ...primaryNavigationItems,
  { label: "Work With Us", href: "/work-with-us" },
] satisfies readonly NavigationItem[];

export const mobileNavigationItems = navigationItems;
