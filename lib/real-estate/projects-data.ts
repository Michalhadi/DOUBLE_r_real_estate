import { PROPERTIES, type Property } from "./data";
import { PROJECT_FUNNEL } from "./dashboard-data";

export type ProjectState = "Active" | "Draft" | "Paused";

export interface ProjectRow {
  slug: string;
  name: string;
  city: string;
  type: string;
  state: ProjectState;
  leads: number;
  booked: number;
  rep: string;
  channel: "WhatsApp" | "Web link";
  synced: string;
}

export const PROJECT_ROWS: ProjectRow[] = [
  ...PROPERTIES.map((p, i) => {
    const f = PROJECT_FUNNEL.find((x) => x.slug === p.slug)!;
    return { slug: p.slug, name: p.name, city: p.city, type: p.type, state: "Active" as ProjectState, leads: f.entered, booked: f.booked, rep: "Dana", channel: (i === 1 ? "Web link" : "WhatsApp") as "WhatsApp" | "Web link", synced: i === 0 ? "Today, 6:00 AM" : "Yesterday" };
  }),
  { slug: "park-residences", name: "Park Residences", city: "Netanya", type: "New-build apartments", state: "Draft", leads: 0, booked: 0, rep: "Dana", channel: "WhatsApp", synced: "—" },
];

export const WIZARD_STEPS = ["Details", "Media", "Qualification", "Rep", "Channels", "Test", "Publish"];

export const QUAL_QUESTIONS = [
  { id: "purpose", label: "Home or investment?", sub: "Decides which units and what to emphasise", on: true, required: true },
  { id: "budget", label: "Budget range", sub: "Asked after the price list is shown", on: true, required: true },
  { id: "mortgage", label: "Mortgage pre-approval / need to sell a home", sub: "The strongest signal of a serious buyer", on: true, required: true },
  { id: "timing", label: "When do you want to move?", sub: "Matches the delivery date", on: true, required: false },
  { id: "family", label: "Family size / rooms needed", sub: "Narrows the layouts offered", on: false, required: false },
  { id: "area", label: "Preferred area", sub: "Used to offer other projects", on: false, required: false },
];

export interface DraftForm {
  name: string; type: string; city: string; neighborhood: string; tagline: string; descr: string;
  priceFrom: string; priceTo: string; delivery: string; paymentTerms: string; highlights: string; amenities: string; units: string;
}

export const EMPTY_FORM: DraftForm = {
  name: "", type: "New-build apartments", city: "", neighborhood: "", tagline: "", descr: "",
  priceFrom: "", priceTo: "", delivery: "", paymentTerms: "", highlights: "", amenities: "", units: "",
};

/** What "Fill from brochure" extracts in the demo. */
export const BROCHURE_SAMPLE: DraftForm = {
  name: "Park Residences", type: "New-build apartments", city: "Netanya", neighborhood: "Poleg",
  tagline: "Green living, five minutes from the sea",
  descr: "Three boutique buildings around a private park. 3 to 5 room apartments with large balconies, close to the beach and the train.",
  priceFrom: "2750000", priceTo: "5400000", delivery: "Q2 2028",
  paymentTerms: "15% on signing, 85% linked to construction milestones",
  highlights: "Private park, Walk to the beach, 7 minutes to the train",
  amenities: "Pool, Gym, 2 parking spaces, Storage room",
  units: "3 rooms · 86 sqm, 4 rooms · 110 sqm, 5 rooms · 138 sqm, Penthouse · 190 sqm",
};

const list = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

export function formToProperty(f: DraftForm, slug = "draft"): Property {
  const from = Number(f.priceFrom) || 0;
  const to = Number(f.priceTo) || from;
  const units = list(f.units).map((u, i) => {
    const [label, sqm] = u.split("·").map((x) => x.trim());
    return { id: `u${i}`, label: label || "Unit", rooms: i + 3, sqm: parseInt(sqm ?? "") || 90, floor: "—", priceFrom: from + i * 500000 };
  });
  return {
    slug, name: f.name || "Your project", type: f.type, status: "Selling now", city: f.city || "City",
    neighborhood: f.neighborhood || f.city || "Neighborhood", developer: "Skyline Developments",
    tagline: f.tagline || "Your tagline appears here", descr: f.descr || "Add a short description.",
    highlights: list(f.highlights), amenities: list(f.amenities), delivery: f.delivery || "TBD",
    paymentTerms: f.paymentTerms || "Payment terms not set", priceFrom: from, priceTo: to,
    units: units.length ? units : [{ id: "u0", label: "3 rooms", rooms: 3, sqm: 88, floor: "—", priceFrom: from }],
    palette: { sky: "#cfe6f5", wall: "#f4efe6", accent: "#1f6f8b", glass: "#7fb3cc" }, salesRep: "Dana",
  };
}
