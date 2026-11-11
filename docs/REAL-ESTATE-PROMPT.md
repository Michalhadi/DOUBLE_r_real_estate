# Double R — Real estate edition (Claude Code build prompt)

Adapt the Double R recruiting system to real estate. Everything is in English, LTR.
Keep the recruiting product untouched: all real-estate code lives under `app/real-estate`, `components/real-estate`, `lib/real-estate`.
One phase at a time. Finish, run checks, report, wait for approval.

## Mapping

| Recruiting | Real estate |
|---|---|
| Job | Property / project |
| Candidate | Lead (buyer or renter) |
| AI interview | Qualification chat: own home vs investment, budget, mortgage pre-approval, timing |
| Booked interview | Booked viewing / sales meeting |
| Civi (ATS) | Google Sheets first; Bambi, Shakal, Nadlan2U later (via webhook / Zapier / API) |
| Agency agent | Property agent that knows every project |
| Noa (one persona) | One rep persona per tenant (name, photo, tone, logo, brand colors) |

Customers: property developers and brokerages. One base prompt for all agents; per-property variable fields make it specific.

## Property fields (the variables in the base prompt)

`project.name · type · status · city · neighborhood · address · price_from · price_to · rooms · size_sqm · floors · delivery_date · descr · highlights · amenities · payment_terms · faq · developer_name · sales_rep · media`
Tenant-level: `rep.name · rep.photo · rep.tone · brand.logo · brand.colors`

## Lead entry points (all land in one pipeline)

1. Meta / Google lead forms (via Zapier, Make or webhook)
2. Website form (POST to us)
3. CRM push (inbound webhook)

Every lead arrives as: name, phone, project_id, source, consent. First message is an approved WhatsApp template with the lead's name and the project of interest. Source is stored forever. Results go back out to the Google Sheet (status, rating, budget, mortgage, meeting, summary).

## Phases (in this order)

### Phase 1 — Prototypes  (`/real-estate/prototypes`)  ✅ built
Property ad · AI sales chat (web) · AI sales chat (WhatsApp) · Property agent. Visual first: rendering hero, unit and floor-plan cards inside the chat, DoneCard on booking. Renderings are placeholders (`RenderArt`) until the Media library exists.

### Phase 2 — All-properties page  (`/real-estate/properties`)
Same idea as the Hebrew all-jobs page, in English: tenant header, rep widget, filters (city, type, price, rooms, status), property cards with rendering, a "Chat with <rep>" button per property that opens the web chat.

### Phase 3 — Dashboard  (`/real-estate/dashboard`)
Leads today, viewings booked, qualification rate, by source (Meta / Google / website / CRM), by property. Lead table with budget, mortgage status, rating, viewing slot, last activity. Sheet sync status.

### Phase 4 — Onboarding  (`/real-estate/onboarding`)
Connect WhatsApp, connect Google Sheet, create rep persona (name, photo, tone, brand), add first property with media, submit the opening template, copy lead-form webhook URL.

### Later
Media library (renderings, photos, floor plans, video) with the agent sending the right asset by intent · Bambi / Shakal / Nadlan2U adapters · reminders and follow-ups · nurture of past leads.

## Rules
- No hardcoded hex outside tokens; use existing `var(--…)` tokens
- Prompts and templates are data, not code
- Every lead stores its source; every conversation captures phone and email
- Business-initiated WhatsApp messages need an approved template and recorded consent
