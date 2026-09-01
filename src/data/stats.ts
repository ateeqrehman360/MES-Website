export type ImpactStatistic = {
  id: string;
  label: string;
  displayValue: string;
  // Optional count-up target, expressed in the displayed unit (e.g. 422 K).
  value?: number;
  prefix?: string;
  suffix?: string;
};

export const impactStatistics: readonly ImpactStatistic[] = [
  {
    id: "events",
    displayValue: "17",
    value: 17,
    label: "Events hosted & collaborated on",
  },
  {
    id: "attendees",
    displayValue: "TBC",
    label: "Attendees",
  },
  {
    id: "social-views",
    displayValue: "422K+",
    value: 422,
    suffix: "K+",
    label: "Social views",
  },
  {
    id: "raised",
    displayValue: "£1,400+",
    value: 1400,
    prefix: "£",
    suffix: "+",
    label: "Raised",
  },
  {
    id: "since",
    displayValue: "Since 2024",
    label: "Building Muslim entrepreneurship at MMU",
  },
];

// Internal provenance, not additional public copy:
// 17 events = 14 hosted by MES + 3 collaborations.
// Approved 422K+ display = 422,792 views (169,972 Reel + 252,820 post views).
// Attendance remains TBC; no estimate is substituted.
