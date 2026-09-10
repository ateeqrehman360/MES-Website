export type JourneyMilestoneImportance = "major" | "minor" | "current";

export type JourneyMilestonePlacement =
  | "copy-left"
  | "copy-right"
  | "media-left"
  | "media-right";

export type JourneyRoutePosition = "left" | "centre" | "right";

export type JourneyMilestoneImage = Readonly<{
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: "photo" | "mark";
  objectPosition?: string;
  blurDataURL?: string;
}>;

export type JourneySupportingDetail = Readonly<{
  value: string;
  label: string;
}>;

export type JourneyMilestone = Readonly<{
  id: string;
  date: string;
  dateTime: string;
  title: string;
  description: string;
  importance: JourneyMilestoneImportance;
  placement: JourneyMilestonePlacement;
  route: JourneyRoutePosition;
  image?: JourneyMilestoneImage;
  supportingDetails?: readonly JourneySupportingDetail[];
}>;

export const journeyMilestones = [
  {
    id: "founded",
    date: "October 2024",
    dateTime: "2024-10",
    title: "Founded",
    description: "MES began at Manchester Metropolitan University.",
    importance: "major",
    placement: "copy-left",
    route: "centre",
  },
  {
    id: "entrepreneurs-society",
    date: "2024",
    dateTime: "2024",
    title: "Joined Entrepreneurs Society",
    description: "An early chapter within the Entrepreneurs Society.",
    importance: "minor",
    placement: "media-left",
    route: "left",
    image: {
      src: "/network/logos/partner-entrepreneurs_society.webp",
      alt: "Entrepreneurs Society logo.",
      width: 480,
      height: 479,
      kind: "mark",
    },
  },
  {
    id: "first-event",
    date: "November 2024",
    dateTime: "2024-11",
    title: "First event",
    description: "MES hosted its first event.",
    importance: "major",
    placement: "copy-left",
    route: "right",
  },
  {
    id: "mmu-isoc",
    date: "July 2025",
    dateTime: "2025-07",
    title: "Joined MMU ISoc",
    description: "MES continued its work within MMU Islamic Society.",
    importance: "minor",
    placement: "media-right",
    route: "left",
    image: {
      src: "/network/logos/partner-mmu_isoc.webp",
      alt: "MMU Islamic Society logo.",
      width: 216,
      height: 480,
      kind: "mark",
    },
  },
  {
    id: "halal-business-series",
    date: "November 2025",
    dateTime: "2025-11",
    title: "Halal Business Series",
    description: "A landmark session with Ibrahim Khan.",
    importance: "major",
    placement: "media-left",
    route: "centre",
    image: {
      src: "/hero/halal-business-series-audience.webp",
      alt: "An audience listening during an MES Halal Business Series event.",
      width: 1600,
      height: 1200,
      kind: "photo",
      objectPosition: "center 58%",
    },
    supportingDetails: [
      { value: "60", label: "attendees" },
      { value: "£1,400", label: "raised" },
    ],
  },
  {
    id: "ramadhan-bazaar",
    date: "March 2026",
    dateTime: "2026-03",
    title: "Ramadhan Bazaar",
    description: "A major MES event built around business and community.",
    importance: "major",
    placement: "media-right",
    route: "left",
    image: {
      src: "/hero/ramadhan-bazaar-crowd.webp",
      alt: "Visitors browsing independent businesses at the MES Ramadhan Bazaar.",
      width: 900,
      height: 1600,
      kind: "photo",
      objectPosition: "center 50%",
      blurDataURL:
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    },
    supportingDetails: [{ value: "15", label: "stalls" }],
  },
  {
    id: "independent-mmu-society",
    date: "September 2026",
    dateTime: "2026-09",
    title: "Became our own MMU society",
    description:
      "MES became an independent MMU Students’ Union society—separate from ISoc, while remaining open to collaboration.",
    importance: "current",
    placement: "copy-right",
    route: "right",
  },
] satisfies readonly JourneyMilestone[];
