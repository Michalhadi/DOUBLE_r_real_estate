"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../_css/interview.module.css";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Bubble } from "@/components/chat/Bubble";
import { Composer } from "@/components/chat/Composer";
import { TimeSlot } from "@/components/chat/TimeSlot";
import { DoneCard } from "@/components/chat/DoneCard";
import { PropertyCard, RepAvatar, UnitCard } from "@/components/real-estate/parts";
import { QUALIFICATION, REP, VIEWING_SLOTS, getProperty, matchUnit } from "@/lib/real-estate/data";

type Stage = "intro" | { q: number } | "match" | "slots" | "done";

export function ChatClient({ slug }: { slug: string }) {
  const p = getProperty(slug)!;
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<string[]>([]);
  const [slot, setSlot] = useState<(typeof VIEWING_SLOTS)[number] | null>(null);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [stage, answers, slot]);

  const qIndex = typeof stage === "object" ? stage.q : QUALIFICATION.length;
  const unit = matchUnit(p);

  function answer(text: string) {
    if (typeof stage !== "object") return;
    const next = [...answers];
    next[stage.q] = text;
    setAnswers(next);
    setStage(stage.q + 1 < QUALIFICATION.length ? { q: stage.q + 1 } : "match");
  }

  return (
    <main className={styles.page}>
      <div className={styles.phone}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <span className={styles.mark}>{REP.company[0]}</span>
            <span className={styles.brandName}>{REP.company}</span>
          </div>
          <Badge tone="brand">{p.name}</Badge>
        </header>

        <div className={styles.conversation}>
          {stage === "intro" ? (
            <div className={styles.introCard}>
              <PropertyCard p={p} tall />
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <RepAvatar large />
                <div>
                  <div className={styles.jobTitle}>{REP.name}</div>
                  <div className={styles.jobMeta}>{REP.title} · {REP.company}</div>
                </div>
              </div>
              <p className={styles.introText}>
                Hi! I&apos;m {REP.name}. Thanks for your interest in {p.name}. A few quick questions, and I&apos;ll show you the apartment that fits you best and book a viewing.
              </p>
              <p className={styles.reassurance}>2 minutes · Type or speak · No obligation</p>
              <Button variant="primary" className={styles.startButton} onClick={() => setStage({ q: 0 })}>
                Start chat
              </Button>
            </div>
          ) : (
            <>
              {QUALIFICATION.slice(0, qIndex + 1).map((q, i) => (
                <div key={i} className={styles.turn}>
                  <Bubble from="bot">{q.prompt(p)}</Bubble>
                  {answers[i] && <Bubble from="candidate">{answers[i]}</Bubble>}
                </div>
              ))}

              {typeof stage === "object" && (
                <Composer
                  key={stage.q}
                  placeholder={QUALIFICATION[stage.q].placeholder}
                  defaultValue={QUALIFICATION[stage.q].sample}
                  onSend={answer}
                />
              )}

              {(stage === "match" || stage === "slots" || stage === "done") && (
                <>
                  <Bubble from="bot">
                    Perfect, thank you. Based on what you told me, this one looks like the best fit:
                  </Bubble>
                  <UnitCard p={p} u={unit} />
                  <Bubble from="bot">
                    {`It includes ${p.amenities.slice(0, 2).join(" and ").toLowerCase()}, and delivery is ${p.delivery}. Want to see it in person? Pick a time for a viewing with our sales team:`}
                  </Bubble>
                </>
              )}

              {stage === "match" && (
                <div className={styles.slots}>
                  {VIEWING_SLOTS.map((s) => (
                    <TimeSlot key={s.iso} time={s.label} onClick={() => { setSlot(s); setStage("done"); }} />
                  ))}
                </div>
              )}

              {stage === "done" && slot && (
                <>
                  <Bubble from="candidate">{`${slot.label} works for me.`}</Bubble>
                  <DoneCard
                    title="Viewing booked"
                    description={`${slot.label} · ${p.name}, ${p.neighborhood}. ${REP.name} will meet you at the sales office. A confirmation is on its way to you on WhatsApp.`}
                  />
                </>
              )}
              <div ref={end} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
