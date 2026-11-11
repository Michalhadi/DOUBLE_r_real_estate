import { PROPERTIES, formatPrice, type Property } from "./data";

export interface Answer {
  text: string;
  offerBooking?: boolean;
  image?: string;
}

/** Demo answers built from the property fields. In production the LLM answers from the same fields. */
export function answerFor(p: Property, q: string): Answer {
  const t = q.toLowerCase();
  const has = (re: RegExp) => re.test(t);
  if (has(/photo|picture|image|inside|interior|look like/) && p.images)
    return { text: "Here's a look inside a typical apartment. Want to see it in person?", image: p.images.gallery[0], offerBooking: true };
  if (has(/book|visit|view|see it|meet|appointment|tour/))
    return { text: "Of course. Pick a time that suits you and I'll book it with our sales team.", offerBooking: true };
  if (has(/price|cost|how much|budget|expensive/))
    return { text: `${p.name} apartments range from ${formatPrice(p.priceFrom)} to ${formatPrice(p.priceTo)}. ${p.units.map((u) => `${u.label}: from ${formatPrice(u.priceFrom)}`).join(" · ")}. What budget do you have in mind?`, offerBooking: true };
  if (has(/pay|payment|deposit|mortgage|financ/))
    return { text: `Payment terms: ${p.paymentTerms}. If you'd like, I can note your budget and pass it to our sales team.`, offerBooking: true };
  if (has(/deliver|ready|move in|when|complete|occup/))
    return { text: `Delivery is ${p.delivery}.` };
  if (has(/park/)) return { text: `Parking is included: ${p.amenities.find((a) => /park/i.test(a)) ?? "underground parking"}.` };
  if (has(/amenit|gym|pool|facilit|storage|balcon/))
    return { text: `The building includes: ${p.amenities.join(", ")}.` };
  if (has(/room|size|sqm|big|floor plan|plan|layout|unit|apartment/))
    return { text: `Available layouts: ${p.units.map((u) => `${u.label} (${u.sqm} sqm, floors ${u.floor})`).join(" · ")}.`, offerBooking: true };
  if (has(/where|location|area|neighbo|near|walk|beach|school|train|rail|commute/))
    return { text: `${p.name} is in ${p.neighborhood}, ${p.city}. ${p.highlights.join(". ")}.` };
  if (has(/invest|yield|rent/))
    return { text: `For investment: ${p.highlights.join(", ").toLowerCase()}. ${p.type}. Want me to arrange a call with our sales team?`, offerBooking: true };
  if (has(/other|another|different|more project|else/)) {
    const o = PROPERTIES.filter((x) => x.slug !== p.slug).map((x) => `${x.name} (${x.city}, from ${formatPrice(x.priceFrom)})`).join(" · ");
    return { text: `We also have: ${o}. Want to hear about one of them?` };
  }
  return { text: `${p.descr} Ask me anything — prices, layouts, payments, delivery or the area.`, offerBooking: true };
}

export const SUGGESTED = (p: Property) => [
  "What are the prices?",
  `What's the delivery date?`,
  "Show me the layouts",
  "Is there parking?",
  `Tell me about ${p.neighborhood}`,
];
