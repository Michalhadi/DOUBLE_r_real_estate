export type Palette = { sky: string; wall: string; accent: string; glass: string };

export interface Unit {
  id: string;
  label: string;
  rooms: number;
  sqm: number;
  floor: string;
  priceFrom: number;
}

export interface Property {
  slug: string;
  name: string;
  type: string;
  status: string;
  city: string;
  neighborhood: string;
  developer: string;
  tagline: string;
  descr: string;
  highlights: string[];
  amenities: string[];
  delivery: string;
  paymentTerms: string;
  priceFrom: number;
  priceTo: number;
  units: Unit[];
  palette: Palette;
  salesRep: string;
  images?: { hero: string; gallery: string[] };
}

export interface Rep {
  name: string;
  initials: string;
  company: string;
  title: string;
  tone: string;
  photo?: string;
}

/** One persona per tenant (developer or brokerage). Set once in onboarding. */
export const REP: Rep = {
  name: "Dana",
  initials: "D",
  company: "Skyline Developments",
  title: "Sales assistant",
  tone: "warm, direct",
  photo: "/real-estate/dana.png",
};

export const PROPERTIES: Property[] = [
  {
    slug: "marina-towers",
    name: "Marina Towers",
    type: "New-build apartments",
    status: "Selling now",
    city: "Herzliya",
    neighborhood: "Herzliya Marina",
    developer: "Skyline Developments",
    tagline: "Sea-view living, 5 minutes from the marina",
    descr:
      "Two 28-storey towers with 3 to 5 room apartments, private balconies and underground parking, a short walk from the beach.",
    highlights: ["Sea views from floor 8 up", "Walk to the beach", "Rail station 6 minutes away"],
    amenities: ["Pool & gym", "2 parking spaces", "Storage room", "24/7 lobby"],
    delivery: "Q3 2028",
    paymentTerms: "20% on signing, 80% linked to construction milestones",
    priceFrom: 3250000,
    priceTo: 6900000,
    salesRep: "Dana",
    images: { hero: "/real-estate/marina-hero.webp", gallery: ["/real-estate/marina-interior.png"] },
    palette: { sky: "#cfe6f5", wall: "#f4efe6", accent: "#1f6f8b", glass: "#7fb3cc" },
    units: [
      { id: "m3", label: "3 rooms", rooms: 3, sqm: 88, floor: "6–12", priceFrom: 3250000 },
      { id: "m4", label: "4 rooms", rooms: 4, sqm: 112, floor: "8–20", priceFrom: 4350000 },
      { id: "m5", label: "5 rooms · Garden", rooms: 5, sqm: 146, floor: "Ground", priceFrom: 5200000 },
      { id: "mp", label: "Penthouse", rooms: 6, sqm: 210, floor: "27–28", priceFrom: 6900000 },
    ],
  },
  {
    slug: "olive-garden",
    name: "Olive Garden Residences",
    type: "Boutique low-rise",
    status: "Last units",
    city: "Modi'in",
    neighborhood: "Buchman",
    developer: "Skyline Developments",
    tagline: "A quiet courtyard community with room to grow",
    descr:
      "Six-storey boutique buildings around shared gardens. Family-sized apartments, schools and parks within walking distance.",
    highlights: ["Walk to schools and parks", "Shared courtyard gardens", "Ready for move-in"],
    amenities: ["Playground", "Parking", "Storage room", "Rooftop terrace"],
    delivery: "Ready to move in",
    paymentTerms: "30% on signing, balance on delivery",
    priceFrom: 2480000,
    priceTo: 3900000,
    salesRep: "Dana",
    palette: { sky: "#f6e7cf", wall: "#efe9dd", accent: "#5f7f3b", glass: "#9db981" },
    units: [
      { id: "o3", label: "3 rooms", rooms: 3, sqm: 82, floor: "1–5", priceFrom: 2480000 },
      { id: "o4", label: "4 rooms", rooms: 4, sqm: 104, floor: "2–6", priceFrom: 3100000 },
      { id: "o5", label: "5 rooms · Roof", rooms: 5, sqm: 138, floor: "6", priceFrom: 3900000 },
    ],
  },
  {
    slug: "central-lofts",
    name: "Central Lofts",
    type: "Investment apartments",
    status: "Selling now",
    city: "Tel Aviv",
    neighborhood: "Florentin",
    developer: "Skyline Developments",
    tagline: "Compact lofts built for rental yield",
    descr:
      "Studios and 2-room lofts in a lively neighborhood, designed for strong rental demand and low maintenance.",
    highlights: ["Est. 3.4% rental yield", "Furnished option", "Steps from the light rail"],
    amenities: ["Co-working lounge", "Bike storage", "Rooftop", "Smart-home wiring"],
    delivery: "Q1 2027",
    paymentTerms: "10% on signing, 90% on delivery",
    priceFrom: 1690000,
    priceTo: 2450000,
    salesRep: "Dana",
    palette: { sky: "#e4dcf3", wall: "#ece8f1", accent: "#6a3fb0", glass: "#a68bd6" },
    units: [
      { id: "c1", label: "Studio", rooms: 1, sqm: 38, floor: "2–8", priceFrom: 1690000 },
      { id: "c2", label: "2 rooms", rooms: 2, sqm: 56, floor: "3–9", priceFrom: 2450000 },
    ],
  },
];

export const getProperty = (slug: string) => PROPERTIES.find((p) => p.slug === slug);

export const formatPrice = (n: number) => `₪${n.toLocaleString("en-US")}`;
export const priceRange = (p: Property) =>
  `${formatPrice(p.priceFrom)} – ${formatPrice(p.priceTo)}`;

export interface QualQuestion {
  prompt: (p: Property) => string;
  placeholder: string;
  sample: string;
}

/** Qualification questions: the deciding ones first. Replaced by the base prompt in production. */
export const QUALIFICATION: QualQuestion[] = [
  {
    prompt: () => "Great! Is this for your own home, or an investment?",
    placeholder: "Home or investment…",
    sample: "For us to live in, we're a family of four.",
  },
  {
    prompt: (p) =>
      `${p.name} apartments start at ${formatPrice(p.priceFrom)}. Does that fit the budget you have in mind?`,
    placeholder: "Your budget range…",
    sample: "We're looking at up to 4.5 million.",
  },
  {
    prompt: () =>
      "Do you already have a mortgage pre-approval, or do you need to sell a current home first?",
    placeholder: "Type your answer…",
    sample: "We have a pre-approval and we're selling our current apartment in the next few months.",
  },
];

export const VIEWING_SLOTS = [
  { iso: "2026-11-15T10:00", label: "Sun, Nov 15 · 10:00" },
  { iso: "2026-11-16T17:30", label: "Mon, Nov 16 · 17:30" },
  { iso: "2026-11-18T12:00", label: "Wed, Nov 18 · 12:00" },
];

export function matchUnit(p: Property, budget = 4500000, rooms = 4): Unit {
  const fits = p.units.filter((u) => u.priceFrom <= budget);
  return fits.find((u) => u.rooms === rooms) ?? fits[fits.length - 1] ?? p.units[0];
}
