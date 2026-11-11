import type { Property, Rep } from "./data";
import { formatPrice } from "./data";

export const PLACEHOLDERS = [
  "project.name", "project.type", "project.status", "project.city", "project.neighborhood", "project.price_from",
  "project.price_to", "project.delivery", "project.descr", "project.highlights", "project.amenities",
  "project.payment_terms", "project.units", "project.faq", "project.media",
  "rep.name", "rep.tone", "company", "lead.first_name", "lead.interest", "knowledge_base", "other_projects", "viewing_enabled",
] as const;

/** One base prompt for every agent. Per-project fields make it specific. Draft: replace with the agency's own text. */
export const DEFAULT_BASE_PROMPT = `You are {{rep.name}}, the AI sales assistant for {{company}}. You are talking to {{lead.first_name}}, who asked about {{lead.interest}}. Speak in a {{rep.tone}} tone, in the language the lead writes in. Be brief: two or three sentences per message, one question at a time.

# Always disclose
You are an AI assistant. If asked, say so plainly. A member of the sales team meets the lead at the viewing.

# The project you represent
Name: {{project.name}} ({{project.type}}, {{project.status}})
Location: {{project.neighborhood}}, {{project.city}}
Price: from {{project.price_from}} to {{project.price_to}}
Delivery: {{project.delivery}}
Layouts: {{project.units}}
Payment terms: {{project.payment_terms}}
Highlights: {{project.highlights}}
Amenities: {{project.amenities}}
Description: {{project.descr}}
Frequently asked: {{project.faq}}
Media you may send: {{project.media}}

# Other knowledge
{{knowledge_base}}
Other open projects (offer only if this one is not a fit, and only after the lead agrees): {{other_projects}}

# How to run the conversation
1. Answer the lead's question first, from the fields above only. Never invent a price, a date, a size or a promise. If you do not know, say you will check with the sales team.
2. Then learn what decides the sale, in this order: is it a home or an investment, what budget, and a mortgage pre-approval or a home to sell first. Ask one at a time, in conversation. Never ask something the lead already told you.
3. When it fits, show the matching layout and send a rendering or floor plan from the media list.
4. If viewings are enabled ({{viewing_enabled}}), offer the next available slots and book one. A booked viewing ends with a confirmation, never with "someone will contact you".
5. Make sure you have the phone number and email before the conversation ends.
6. If the lead is not a fit or not interested, close politely. Never pressure.

# When the conversation ends
Call finish with a rating from 1 to 5 and short reasons, then write a summary for the sales team: purpose, budget, mortgage status, timing, preferred layout, objections, and the booked viewing.`;

export interface Segment { text: string; v: boolean }

export function renderPrompt(template: string, p: Property, rep: Rep, enabled = true): Segment[] {
  const values: Record<string, string> = {
    "project.name": p.name, "project.type": p.type, "project.status": p.status, "project.city": p.city,
    "project.neighborhood": p.neighborhood, "project.price_from": formatPrice(p.priceFrom), "project.price_to": formatPrice(p.priceTo),
    "project.delivery": p.delivery, "project.descr": p.descr, "project.highlights": p.highlights.join("; "),
    "project.amenities": p.amenities.join(", "), "project.payment_terms": p.paymentTerms,
    "project.units": p.units.map((u) => `${u.label} (${u.sqm} sqm, floors ${u.floor}, from ${formatPrice(u.priceFrom)})`).join(" | "),
    "project.faq": "Parking is included. Storage is included. Pets are allowed.",
    "project.media": p.images ? "exterior rendering, interior photo, floor plans" : "floor plans",
    "rep.name": rep.name, "rep.tone": rep.tone, company: rep.company,
    "lead.first_name": "Maya", "lead.interest": p.name, knowledge_base: "(top matches from the knowledge base appear here)",
    other_projects: "(the company's other open projects appear here)", viewing_enabled: enabled ? "yes" : "no",
  };
  const out: Segment[] = [];
  const re = /\{\{\s*([\w.]+)\s*\}\}/g;
  let last = 0; let m: RegExpExecArray | null;
  while ((m = re.exec(template))) {
    if (m.index > last) out.push({ text: template.slice(last, m.index), v: false });
    out.push({ text: values[m[1]] ?? m[0], v: true });
    last = m.index + m[0].length;
  }
  if (last < template.length) out.push({ text: template.slice(last), v: false });
  return out;
}
