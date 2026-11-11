"use client";

import { useState } from "react";
import Link from "next/link";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import styles from "../_css/prototypes.module.css";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-display" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-body" });

interface Prototype {
  id: string;
  group: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
}

const PROTOTYPES: Prototype[] = [
  {
    id: "ad",
    group: "Buyer journey",
    title: "Property ad",
    subtitle: "Sponsored post",
    description: "Where a buyer first meets the project. One tap opens the project page with the AI sales assistant.",
    href: "/real-estate/ad/marina-towers?cta=/real-estate/project/marina-towers",
  },
  {
    id: "page",
    group: "Buyer journey",
    title: "Project page",
    subtitle: "Chat or talk to the AI rep",
    description: "A full-screen project page. Ask the AI sales assistant anything by typing or talking, then book a viewing.",
    href: "/real-estate/project/marina-towers",
  },
  {
    id: "wa",
    group: "Buyer journey",
    title: "AI sales chat",
    subtitle: "WhatsApp",
    description: "The same conversation, started from a WhatsApp message the lead agreed to receive.",
    href: "/real-estate/whatsapp?property=marina-towers",
  },
  {
    id: "all",
    group: "Developer / brokerage",
    title: "All properties",
    subtitle: "Browse and filter",
    description: "Every project in one page, with filters and the AI rep one tap away on each card.",
    href: "/real-estate/properties",
  },
  {
    id: "dash",
    group: "Developer / brokerage",
    title: "Dashboard",
    subtitle: "Leads, viewings, sources",
    description: "The sales team's overview: new leads, booked viewings, qualification and where leads come from.",
    href: "/real-estate/dashboard",
  },
  {
    id: "agent",
    group: "Developer / brokerage",
    title: "Property agent",
    subtitle: "Knows every project",
    description: "A chat on the website. Buyers ask about any project and get matched to the right one.",
    href: "/real-estate/agent",
  },
];

const GROUPS = ["Buyer journey", "Developer / brokerage"];

export default function RealEstatePrototypesPage() {
  const [activeId, setActiveId] = useState(PROTOTYPES[0].id);
  const index = PROTOTYPES.findIndex((p) => p.id === activeId);
  const active = PROTOTYPES[index];
  const next = PROTOTYPES[(index + 1) % PROTOTYPES.length];

  return (
    <main className={`${styles.page} ${display.variable} ${body.variable}`}>
      <aside className={styles.side}>
        <div className={styles.brand}>
          <span className={styles.mark}>R</span>
          <span className={styles.brandName}>Double R · Real estate</span>
        </div>

        <h1 className={styles.title}>Prototypes</h1>
        <p className={styles.subtitle}>Pick one and try it. The phone on the right is live.</p>

        <nav className={styles.nav} aria-label="Prototypes">
          {GROUPS.map((group) => (
            <div key={group} className={styles.group} role="group" aria-label={group}>
              <span className={styles.groupLabel}>{group}</span>
              {PROTOTYPES.filter((p) => p.group === group).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={[styles.item, p.id === activeId && styles.itemActive].filter(Boolean).join(" ")}
                  aria-current={p.id === activeId ? "true" : undefined}
                  onClick={() => setActiveId(p.id)}
                >
                  <span className={styles.itemTitle}>{p.title}</span>
                  <span className={styles.itemSubtitle}>{p.subtitle}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <section className={styles.stage}>
        <div className={styles.stageHeader}>
          <div aria-live="polite">
            <h2 className={styles.stageTitle}>
              {active.title} <span className={styles.stageSub}>/ {active.subtitle}</span>
            </h2>
            <p className={styles.stageDescription}>{active.description}</p>
          </div>
          <div className={styles.actions}>
            <Link href={active.href} target="_blank" className={styles.secondary}>
              Open in new tab ↗
            </Link>
            <button type="button" className={styles.primary} onClick={() => setActiveId(next.id)}>
              Next: {next.title} →
            </button>
          </div>
        </div>

        <div className={styles.backdrop}>
          <div className={styles.device}>
            <iframe
              key={active.id}
              src={active.href}
              className={styles.iframe}
              title={`${active.title} — ${active.subtitle}`}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
