import type { BadgeTone } from "@/components/ui/Badge";
import { PROPERTIES } from "./data";

export type LeadStatus = "Booked" | "Qualified" | "In conversation" | "No reply" | "Not interested";
export type Source = "Meta" | "Google" | "Website" | "CRM";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  project: string;
  source: Source;
  purpose: "Home" | "Investment";
  budget: string;
  mortgage: "Pre-approved" | "Needs to sell" | "Cash" | "Unknown";
  rating: number;
  status: LeadStatus;
  viewing: string | null;
  last: string;
}

export const STATUS_TONE: Record<LeadStatus, BadgeTone> = {
  Booked: "success",
  Qualified: "brand",
  "In conversation": "neutral",
  "No reply": "neutral",
  "Not interested": "neutral",
};

const P = (slug: string) => PROPERTIES.find((p) => p.slug === slug)!.name;

export const LEADS: Lead[] = [
  { id: "l1", name: "Maya Cohen", phone: "+972 50 ••• 2125", project: P("marina-towers"), source: "Meta", purpose: "Home", budget: "₪4.5M", mortgage: "Pre-approved", rating: 5, status: "Booked", viewing: "Sun, Nov 15 · 10:00", last: "6 min ago" },
  { id: "l2", name: "Daniel Levi", phone: "+972 52 ••• 8841", project: P("central-lofts"), source: "Google", purpose: "Investment", budget: "₪2.0M", mortgage: "Cash", rating: 5, status: "Booked", viewing: "Mon, Nov 16 · 17:30", last: "22 min ago" },
  { id: "l3", name: "Noa Bar", phone: "+972 54 ••• 3307", project: P("olive-garden"), source: "Website", purpose: "Home", budget: "₪3.2M", mortgage: "Needs to sell", rating: 4, status: "Qualified", viewing: null, last: "41 min ago" },
  { id: "l4", name: "Yossi Mizrahi", phone: "+972 50 ••• 9120", project: P("marina-towers"), source: "Meta", purpose: "Home", budget: "₪5.1M", mortgage: "Pre-approved", rating: 4, status: "Booked", viewing: "Wed, Nov 18 · 12:00", last: "1 h ago" },
  { id: "l5", name: "Tamar Shani", phone: "+972 53 ••• 6672", project: P("marina-towers"), source: "CRM", purpose: "Home", budget: "₪4.0M", mortgage: "Unknown", rating: 3, status: "In conversation", viewing: null, last: "1 h ago" },
  { id: "l6", name: "Omer Katz", phone: "+972 58 ••• 1450", project: P("central-lofts"), source: "Meta", purpose: "Investment", budget: "₪1.8M", mortgage: "Pre-approved", rating: 4, status: "Qualified", viewing: null, last: "2 h ago" },
  { id: "l7", name: "Shira Peretz", phone: "+972 50 ••• 7734", project: P("olive-garden"), source: "Website", purpose: "Home", budget: "₪2.9M", mortgage: "Pre-approved", rating: 5, status: "Booked", viewing: "Sun, Nov 15 · 12:30", last: "3 h ago" },
  { id: "l8", name: "Eitan Golan", phone: "+972 52 ••• 2096", project: P("marina-towers"), source: "Google", purpose: "Home", budget: "₪3.0M", mortgage: "Needs to sell", rating: 2, status: "Not interested", viewing: null, last: "4 h ago" },
  { id: "l9", name: "Lior Avraham", phone: "+972 54 ••• 5518", project: P("central-lofts"), source: "Meta", purpose: "Investment", budget: "—", mortgage: "Unknown", rating: 0, status: "No reply", viewing: null, last: "5 h ago" },
  { id: "l10", name: "Rotem Dahan", phone: "+972 50 ••• 4083", project: P("olive-garden"), source: "Meta", purpose: "Home", budget: "₪3.6M", mortgage: "Pre-approved", rating: 4, status: "In conversation", viewing: null, last: "5 h ago" },
  { id: "l11", name: "Gal Ben-David", phone: "+972 53 ••• 9921", project: P("marina-towers"), source: "Website", purpose: "Home", budget: "₪6.2M", mortgage: "Cash", rating: 5, status: "Qualified", viewing: null, last: "6 h ago" },
  { id: "l12", name: "Adi Friedman", phone: "+972 58 ••• 3340", project: P("central-lofts"), source: "Google", purpose: "Investment", budget: "—", mortgage: "Unknown", rating: 0, status: "No reply", viewing: null, last: "Yesterday" },
];

export interface ProjectFunnel {
  slug: string;
  name: string;
  city: string;
  status: string;
  entered: number;
  qualified: number;
  booked: number;
  timeToViewing: string;
}

export const PROJECT_FUNNEL: ProjectFunnel[] = [
  { slug: "marina-towers", name: "Marina Towers", city: "Herzliya", status: "Selling now", entered: 412, qualified: 268, booked: 71, timeToViewing: "1.0d" },
  { slug: "olive-garden", name: "Olive Garden Residences", city: "Modi'in", status: "Last units", entered: 188, qualified: 131, booked: 44, timeToViewing: "0.8d" },
  { slug: "central-lofts", name: "Central Lofts", city: "Tel Aviv", status: "Selling now", entered: 296, qualified: 159, booked: 38, timeToViewing: "1.6d" },
];

export const SOURCES: { source: Source; leads: number; booked: number }[] = [
  { source: "Meta", leads: 412, booked: 66 },
  { source: "Website", leads: 214, booked: 44 },
  { source: "Google", leads: 161, booked: 27 },
  { source: "CRM", leads: 109, booked: 16 },
];

export const TREND_POINTS = [4.1, 3.2, 2.4, 1.9, 1.4, 1.1];
