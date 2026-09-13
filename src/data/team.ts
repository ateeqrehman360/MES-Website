export type TeamMemberId =
  | "anees"
  | "asma"
  | "ateeq"
  | "isha"
  | "cherine";

export type TeamTier = "primary" | "secondary";

export type TeamLayout =
  | "left-anchor"
  | "centre-focus"
  | "right-anchor"
  | "lower-left"
  | "lower-right";

export type TeamPlaceholderTone =
  | "deep"
  | "muted"
  | "gold"
  | "soft"
  | "forest";

export type TeamMember = Readonly<{
  id: TeamMemberId;
  name: string;
  role: string;
  tier: TeamTier;
  portrait: string | null;
  alt: string;
  objectPosition: string;
  layout: TeamLayout;
  placeholderTone: TeamPlaceholderTone;
}>;

// Portraits are intentionally null while the approved team photography is
// pending. To replace a placeholder, add /public/about/team/{id}.webp and set
// only `portrait` below; `objectPosition` remains available for crop tuning.
export const teamMembers = [
  {
    id: "anees",
    name: "Anees",
    role: "Founder",
    tier: "primary",
    portrait: null,
    alt: "Portrait of Anees",
    objectPosition: "50% 38%",
    layout: "left-anchor",
    placeholderTone: "deep",
  },
  {
    id: "asma",
    name: "Asma",
    role: "President",
    tier: "primary",
    portrait: null,
    alt: "Portrait of Asma",
    objectPosition: "50% 38%",
    layout: "centre-focus",
    placeholderTone: "muted",
  },
  {
    id: "ateeq",
    name: "Ateeq",
    role: "Operations Lead",
    tier: "primary",
    portrait: null,
    alt: "Portrait of Ateeq",
    objectPosition: "50% 38%",
    layout: "right-anchor",
    placeholderTone: "gold",
  },
  {
    id: "isha",
    name: "Isha",
    role: "Events Lead",
    tier: "secondary",
    portrait: null,
    alt: "Portrait of Isha",
    objectPosition: "50% 40%",
    layout: "lower-left",
    placeholderTone: "soft",
  },
  {
    id: "cherine",
    name: "Cherine",
    role: "Publicity Lead",
    tier: "secondary",
    portrait: null,
    alt: "Portrait of Cherine",
    objectPosition: "50% 40%",
    layout: "lower-right",
    placeholderTone: "forest",
  },
] as const satisfies readonly TeamMember[];
