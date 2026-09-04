export type NetworkCategory = "business" | "partner" | "speaker";
export type NetworkLogoShape = "square" | "wide" | "tall";
export type NetworkLogoOpticalSize = "reduced" | "increased";

export type NetworkEntry = {
  id: string;
  name: string;
  category: NetworkCategory;
  alt: string;
  logo: {
    src: string;
    width: number;
    height: number;
  };
  shape: NetworkLogoShape;
  opticalSize?: NetworkLogoOpticalSize;
};

export const networkRows = [
  [
    {
      id: "ac-sneakerz",
      name: "AC Sneakerz",
      category: "business",
      alt: "AC Sneakerz",
      logo: {
        src: "/network/logos/business-acsneakers.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
    },
    {
      id: "human-appeal",
      name: "Human Appeal",
      category: "partner",
      alt: "Human Appeal",
      logo: {
        src: "/network/logos/partner-human_appeal.webp",
        width: 450,
        height: 480,
      },
      shape: "tall",
    },
    {
      id: "fadhl",
      name: "Fadhl",
      category: "business",
      alt: "Fadhl",
      logo: {
        src: "/network/logos/business-fadhl.webp",
        width: 445,
        height: 176,
      },
      shape: "wide",
      opticalSize: "reduced",
    },
    {
      id: "ifg",
      name: "IFG",
      category: "speaker",
      alt: "IFG",
      logo: {
        src: "/network/logos/speaker-ifg.webp",
        width: 480,
        height: 464,
      },
      shape: "square",
      opticalSize: "reduced",
    },
    {
      id: "manchester-central-mosque",
      name: "Manchester Central Mosque",
      category: "partner",
      alt: "Manchester Central Mosque",
      logo: {
        src: "/network/logos/partner-mcm.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
      opticalSize: "increased",
    },
    {
      id: "melted-moments",
      name: "Melted Moments",
      category: "business",
      alt: "Melted Moments",
      logo: {
        src: "/network/logos/business-melted_moments.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
      opticalSize: "increased",
    },
    {
      id: "entrepreneurs-society",
      name: "Entrepreneurs Society",
      category: "partner",
      alt: "Entrepreneurs Society",
      logo: {
        src: "/network/logos/partner-entrepreneurs_society.webp",
        width: 480,
        height: 479,
      },
      shape: "square",
      opticalSize: "increased",
    },
    {
      id: "remarquable",
      name: "Remarquable",
      category: "business",
      alt: "Remarquable",
      logo: {
        src: "/network/logos/business-remarquable.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
      opticalSize: "increased",
    },
    {
      id: "greentech",
      name: "Greentech",
      category: "speaker",
      alt: "Greentech",
      logo: {
        src: "/network/logos/speaker-greentech.webp",
        width: 480,
        height: 143,
      },
      shape: "wide",
      opticalSize: "reduced",
    },
    {
      id: "mmu-isoc",
      name: "MMU ISOC",
      category: "partner",
      alt: "MMU ISOC",
      logo: {
        src: "/network/logos/partner-mmu_isoc.webp",
        width: 216,
        height: 480,
      },
      shape: "tall",
    },
    {
      id: "fuad-fragrances",
      name: "FUAD Fragrances",
      category: "business",
      alt: "FUAD Fragrances",
      logo: {
        src: "/network/logos/business-fuad_fragrances.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
    },
    {
      id: "ppp",
      name: "PPP",
      category: "partner",
      alt: "PPP",
      logo: {
        src: "/network/logos/partner-ppp.webp",
        width: 480,
        height: 461,
      },
      shape: "wide",
    },
    {
      id: "salaam-gifting",
      name: "Salaam Gifting",
      category: "business",
      alt: "Salaam Gifting",
      logo: {
        src: "/network/logos/business-salaam_gifting.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
    },
    {
      id: "monos-markets",
      name: "Monos Markets",
      category: "partner",
      alt: "Monos Markets",
      logo: {
        src: "/network/logos/partner-monos_markets.webp",
        width: 480,
        height: 452,
      },
      shape: "square",
      opticalSize: "increased",
    },
    {
      id: "redwood-founders",
      name: "Redwood Founders",
      category: "speaker",
      alt: "Redwood Founders",
      logo: {
        src: "/network/logos/speaker-redwood_founders.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
    },
    {
      id: "the-perfumatory",
      name: "The Perfumatory",
      category: "business",
      alt: "The Perfumatory",
      logo: {
        src: "/network/logos/business-perfumatory.webp",
        width: 480,
        height: 263,
      },
      shape: "wide",
      opticalSize: "reduced",
    },
    {
      id: "manchester-isoc",
      name: "Manchester ISOC",
      category: "partner",
      alt: "Manchester ISOC",
      logo: {
        src: "/network/logos/partner-manchester_isoc.webp",
        width: 464,
        height: 480,
      },
      shape: "square",
    },
  ],
  [
    {
      id: "alhiba",
      name: "Alhiba",
      category: "business",
      alt: "Alhiba",
      logo: {
        src: "/network/logos/business-alhiba.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
    },
    {
      id: "acsessions",
      name: "ACsessions",
      category: "partner",
      alt: "ACsessions",
      logo: {
        src: "/network/logos/partner-acsessions.webp",
        width: 480,
        height: 371,
      },
      shape: "wide",
    },
    {
      id: "spirituality-of-business",
      name: "Spirituality of Business",
      category: "speaker",
      alt: "Spirituality of Business",
      logo: {
        src: "/network/logos/speaker-spirituality_of_business.webp",
        width: 480,
        height: 195,
      },
      shape: "wide",
      opticalSize: "reduced",
    },
    {
      id: "andaaz-manchester",
      name: "Andaaz Manchester",
      category: "business",
      alt: "Andaaz Manchester",
      logo: {
        src: "/network/logos/business-andaaz.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
    },
    {
      id: "ihsaan",
      name: "Ihsaan",
      category: "partner",
      alt: "Ihsaan",
      logo: {
        src: "/network/logos/partner-ihsaan.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
    },
    {
      id: "bridal-haven",
      name: "Bridal Haven",
      category: "business",
      alt: "Bridal Haven",
      logo: {
        src: "/network/logos/business-bridal_haven.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
      opticalSize: "increased",
    },
    {
      id: "alfurqan-islamic-centre-manchester",
      name: "Alfurqan Islamic Centre Manchester",
      category: "speaker",
      alt: "Alfurqan Islamic Centre Manchester",
      logo: {
        src: "/network/logos/speaker-alfurqan.webp",
        width: 473,
        height: 480,
      },
      shape: "square",
    },
    {
      id: "mmu-bame",
      name: "MMU BAME",
      category: "partner",
      alt: "MMU BAME",
      logo: {
        src: "/network/logos/partner-mmu_bame.webp",
        width: 480,
        height: 304,
      },
      shape: "wide",
      opticalSize: "increased",
    },
    {
      id: "destane-hunar",
      name: "Destane Hunar",
      category: "business",
      alt: "Destane Hunar",
      logo: {
        src: "/network/logos/business-destane_hunar.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
    },
    {
      id: "islamic-help",
      name: "Islamic Help",
      category: "partner",
      alt: "Islamic Help",
      logo: {
        src: "/network/logos/partner-islamic_help.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
    },
    {
      id: "iluur-collections",
      name: "ILUUR Collections",
      category: "business",
      alt: "ILUUR Collections",
      logo: {
        src: "/network/logos/business-iluur.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
    },
    {
      id: "mmu-palestine-society",
      name: "MMU Palestine Society",
      category: "partner",
      alt: "MMU Palestine Society",
      logo: {
        src: "/network/logos/partner-mmu_palsoc.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
    },
    {
      id: "muslim-northern-women",
      name: "Muslim Northern Women",
      category: "speaker",
      alt: "Muslim Northern Women",
      logo: {
        src: "/network/logos/speaker-mnw.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
    },
    {
      id: "mm-henna",
      name: "m.m.henna",
      category: "business",
      alt: "m.m.henna, Henna by Maryam",
      logo: {
        src: "/network/logos/business-mm_henna.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
      opticalSize: "increased",
    },
    {
      id: "salford-isoc",
      name: "Salford ISOC",
      category: "partner",
      alt: "Salford ISOC",
      logo: {
        src: "/network/logos/partner-salford_isoc.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
    },
    {
      id: "surissa-jewellery",
      name: "Surissa Jewellery",
      category: "business",
      alt: "Surissa Jewellery",
      logo: {
        src: "/network/logos/business-surissa.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
    },
    {
      id: "her-tech-future",
      name: "Her Tech Future",
      category: "partner",
      alt: "Her Tech Future",
      logo: {
        src: "/network/logos/partner-htf.webp",
        width: 480,
        height: 480,
      },
      shape: "square",
    },
  ],
] as const satisfies readonly (readonly NetworkEntry[])[];

export const networkEntries = networkRows.flat();
