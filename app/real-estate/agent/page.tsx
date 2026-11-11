"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../_css/interview.module.css";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Bubble } from "@/components/chat/Bubble";
import { Composer } from "@/components/chat/Composer";
import { PropertyCard, RepAvatar } from "@/components/real-estate/parts";
import re from "@/components/real-estate/re.module.css";
import { PROPERTIES, REP, formatPrice, type Property } from "@/lib/real-estate/data";

type Msg = { from: "bot" | "me"; text?: string; card?: Property };

function reply(q: string): Msg[] {
  const t = q.toLowerCase();
  const named = PROPERTIES.find((p) => t.includes(p.name.split(" ")[0].toLowerCase()) || t.includes(p.city.toLowerCase()));
  if (/invest|yield|rent/.test(t)) {
    const p = PROPERTIES.find((x) => x.slug === "central-lofts")!;
    return [{ from: "bot", text: `For investment I'd look at ${p.name}: ${p.highlights[0].toLowerCase()}, from ${formatPrice(p.priceFrom)}.` }, { from: "bot", card: p }];
  }
  if (/family|kids|school|quiet|move in|ready/.test(t)) {
    const p = PROPERTIES.find((x) => x.slug === "olive-garden")!;
    return [{ from: "bot", text: `Families love ${p.name} — ${p.highlights[0].toLowerCase()}, and it's ready to move in.` }, { from: "bot", card: p }];
  }
  if (/sea|view|beach|marina/.test(t)) {
    const p = PROPERTIES.find((x) => x.slug === "marina-towers")!;
    return [{ from: "bot", text: `${p.name} has sea views from floor 8 up and the beach is a short walk away.` }, { from: "bot", card: p }];
  }
  if (named) return [{ from: "bot", text: `${named.name}: ${named.descr}` }, { from: "bot", card: named }];
  if (/price|cost|budget|how much/.test(t)) {
    return [{ from: "bot", text: "Prices range from " + formatPrice(Math.min(...PROPERTIES.map((p) => p.priceFrom))) + " to " + formatPrice(Math.max(...PROPERTIES.map((p) => p.priceTo))) + " depending on the project. What budget do you have in mind?" }];
  }
  return [{ from: "bot", text: "Tell me a bit about what you're looking for — your own home or an investment, and roughly where — and I'll point you to the right project." }];
}

const SUGGESTIONS = ["A family home, ready to move in", "Investment apartment", "Sea view", "What are the prices?"];

export default function AgentPage() {
  const [started, setStarted] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [key, setKey] = useState(0);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs]);

  function send(text: string) {
    setMsgs((m) => [...m, { from: "me", text }, ...reply(text)]);
    setKey((k) => k + 1);
  }

  return (
    <main className={styles.page}>
      <div className={styles.phone}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <span className={styles.mark}>{REP.company[0]}</span>
            <span className={styles.brandName}>{REP.company}</span>
          </div>
          <Badge tone="brand">Property agent</Badge>
        </header>
        <div className={styles.conversation}>
          {!started ? (
            <div className={styles.introCard}>
              <div className={styles.jobLine}>
                <Badge tone="neutral">{PROPERTIES.length} projects</Badge>
                <div>
                  <div className={styles.jobTitle}>All our projects</div>
                  <div className={styles.jobMeta}>{REP.company}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <RepAvatar large />
                <div className={styles.jobTitle}>{REP.name}</div>
              </div>
              <p className={styles.introText}>
                Hi! I&apos;m {REP.name}. I know every project and apartment we have. Tell me what you&apos;re looking for and I&apos;ll show you the best match.
              </p>
              <Button variant="primary" className={styles.startButton} onClick={() => { setStarted(true); setMsgs([{ from: "bot", text: "What are you looking for — a home to live in, or an investment?" }]); }}>
                Start chat
              </Button>
            </div>
          ) : (
            <>
              {msgs.map((m, i) =>
                m.card ? (
                  <PropertyCard key={i} p={m.card} />
                ) : (
                  <Bubble key={i} from={m.from === "bot" ? "bot" : "candidate"}>{m.text ?? ""}</Bubble>
                ),
              )}
              <div className={re.suggest}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className={re.suggestBtn} onClick={() => send(s)}>{s}</button>
                ))}
              </div>
              <Composer key={key} placeholder="Ask about any project…" onSend={send} />
              <div ref={end} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
