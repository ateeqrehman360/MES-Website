export type FeaturedExperience = Readonly<{
  id:
    | "ramadhan-bazaar"
    | "halal-business-series"
    | "learning-to-stay-ahead"
    | "tasbih-making";
  title: string;
  descriptor: string;
  poster: Readonly<{
    src: string;
    width: number;
    height: number;
    alt: string;
  }>;
}>;

export const featuredExperiences = [
  {
    id: "ramadhan-bazaar",
    title: "Ramadhan Bazaar",
    descriptor: "An afternoon of shopping, community & barakah.",
    poster: {
      src: "/events/posters/ramadhan-bazaar.webp",
      width: 1080,
      height: 1350,
      alt: "Poster for the MES Ramadhan Bazaar.",
    },
  },
  {
    id: "halal-business-series",
    title: "Halal Business Series",
    descriptor: "Build with Barakah.",
    poster: {
      src: "/events/posters/halal-business-series.webp",
      width: 1080,
      height: 1350,
      alt: "Build with Barakah event poster from the Halal Business Series.",
    },
  },
  {
    id: "learning-to-stay-ahead",
    title: "How to Keep Learning to Stay Ahead",
    descriptor: "With Saffana Teaches Comms.",
    poster: {
      src: "/events/posters/learning-to-stay-ahead.webp",
      width: 1080,
      height: 1350,
      alt: "Poster for How to Keep Learning to Stay Ahead with Saffana Teaches Comms.",
    },
  },
  {
    id: "tasbih-making",
    title: "Tasbih Making",
    descriptor: "Followed by a halaqah and iftar.",
    poster: {
      src: "/events/posters/tasbih-making.webp",
      width: 1080,
      height: 1350,
      alt: "Poster for the sisters' Tasbih Making event.",
    },
  },
] satisfies readonly FeaturedExperience[];
