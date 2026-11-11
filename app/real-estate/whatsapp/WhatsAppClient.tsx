"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../_css/interview-whatsapp.module.css";
import re from "@/components/real-estate/re.module.css";
import { ChevronLeftIcon, CheckIcon, ClockIcon, PaperclipIcon, SendIcon, MicIcon, SmileIcon } from "@/components/icons";
import { RenderArt } from "@/components/real-estate/RenderArt";
import { variantFor } from "@/components/real-estate/parts";
import { QUALIFICATION, REP, VIEWING_SLOTS, formatPrice, getProperty, matchUnit } from "@/lib/real-estate/data";

type Stage = "intro" | { q: number } | "slots" | "confirmed";

const time = (n: number) => {
  const d = new Date(2026, 0, 1, 18, 4 + n);
  return `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() < 12 ? "AM" : "PM"}`;
};

function Bot({ children, t }: { children: React.ReactNode; t: string }) {
  return (
    <div className={styles.row}>
      <div className={[styles.bubble, styles.bot].join(" ")}>
        <div className={styles.bubbleText}>{children}</div>
        <div className={styles.bubbleMeta}>{t}</div>
      </div>
    </div>
  );
}
function Me({ children, t }: { children: React.ReactNode; t: string }) {
  return (
    <div className={[styles.row, styles.rowUser].join(" ")}>
      <div className={[styles.bubble, styles.user].join(" ")}>
        <div className={styles.bubbleText}>{children}</div>
        <div className={styles.bubbleMeta}>{t} <span className={styles.ticks}><CheckIcon size={13} /></span></div>
      </div>
    </div>
  );
}

export function WhatsAppClient({ slug }: { slug: string }) {
  const p = getProperty(slug)!;
  const unit = matchUnit(p);
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [slot, setSlot] = useState<(typeof VIEWING_SLOTS)[number] | null>(null);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [stage, answers, slot]);

  let n = 0;
  const t = () => time(n++);
  const qCount = typeof stage === "object" ? stage.q + 1 : stage === "intro" ? 0 : QUALIFICATION.length;
  const canType = typeof stage === "object";

  function send() {
    if (typeof stage !== "object" || !draft.trim()) return;
    const next = [...answers];
    next[stage.q] = draft.trim();
    setAnswers(next);
    setDraft("");
    setStage(stage.q + 1 < QUALIFICATION.length ? { q: stage.q + 1 } : "slots");
  }

  return (
    <main className={styles.page}>
      <div className={styles.phone}>
        <header className={styles.header}>
          <button type="button" className={styles.back} aria-label="Back"><ChevronLeftIcon size={22} /></button>
          <div className={styles.avatar} style={{ display: "grid", placeItems: "center", background: "var(--brand)", color: "#fff", fontWeight: 600, overflow: "hidden" }}>
            {REP.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={REP.photo} alt={REP.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 25%" }} />
            ) : REP.initials}
          </div>
          <div className={styles.headerText}>
            <span className={styles.headerName}>{REP.company}</span>
            <span className={styles.headerStatus}>{REP.name} · sales assistant · online</span>
          </div>
        </header>

        <div className={styles.chatArea}>
          <div className={styles.dateChip}>Today</div>
          <div className={styles.encryptionNotice}>Messages are secured with WhatsApp Business end-to-end encryption.</div>

          <div className={styles.row}>
            <div className={[styles.bubble, styles.bot].join(" ")} style={{ padding: 4, maxWidth: "85%" }}>
              {p.images ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.images.hero} alt={p.name} className={`${re.art} ${re.photo}`} />
              ) : (
                <RenderArt palette={p.palette} variant={variantFor(p)} className={re.art} />
              )}
              <div className={styles.bubbleText} style={{ padding: "8px 10px 0" }}>
                Hi Maya 👋 You showed interest in <b>{p.name}</b> in {p.neighborhood}, {p.city}. I&apos;m {REP.name} from {REP.company}. Can I ask you a few quick questions and show you the best apartment for you?
              </div>
              <div className={styles.bubbleMeta} style={{ padding: "0 10px 6px" }}>{t()}</div>
            </div>
          </div>
          {stage === "intro" && (
            <div className={styles.quickReplyCard}>
              <button type="button" className={styles.quickReplyButton} onClick={() => setStage({ q: 0 })}>Yes, let&apos;s start</button>
              <button type="button" className={styles.quickReplyButton}>Not now</button>
            </div>
          )}

          {QUALIFICATION.slice(0, qCount).map((q, i) => (
            <div key={i} className={styles.turn}>
              <Bot t={t()}>{q.prompt(p)}</Bot>
              {answers[i] && <Me t={t()}>{answers[i]}</Me>}
            </div>
          ))}

          {(stage === "slots" || stage === "confirmed") && (
            <>
              <div className={styles.row}>
                <div className={[styles.bubble, styles.bot].join(" ")} style={{ padding: 4, maxWidth: "85%" }}>
                  <RenderArt palette={p.palette} variant="plan" className={re.art} />
                  <div className={styles.bubbleText} style={{ padding: "8px 10px 0" }}>
                    Best fit for you: <b>{unit.label}, {unit.sqm} sqm</b> · floors {unit.floor} · from {formatPrice(unit.priceFrom)}. Want to see it in person?
                  </div>
                  <div className={styles.bubbleMeta} style={{ padding: "0 10px 6px" }}>{t()}</div>
                </div>
              </div>
            </>
          )}

          {stage === "slots" && (
            <div className={styles.listCard}>
              <div className={styles.listCardHeader}>Pick a time for a viewing</div>
              {VIEWING_SLOTS.map((s) => (
                <button key={s.iso} type="button" className={styles.listOption} onClick={() => { setSlot(s); setStage("confirmed"); }}>
                  <span className={styles.listOptionIcon}><ClockIcon size={14} /></span>{s.label}
                </button>
              ))}
            </div>
          )}

          {stage === "confirmed" && slot && (
            <>
              <Me t={t()}>{`${slot.label} works for me.`}</Me>
              <div className={styles.confirmCard}>
                <div className={styles.confirmHeader}>
                  <span className={styles.confirmCheck}><CheckIcon size={16} /></span>
                  <div>
                    <div className={styles.confirmTitle}>Viewing booked</div>
                    <div className={styles.confirmSubtitle}>{REP.name} will meet you at the sales office.</div>
                  </div>
                </div>
                <div className={styles.confirmDetails}>
                  <div className={styles.confirmRow}><span className={styles.confirmLabel}><ClockIcon size={12} /> When</span><span className={styles.confirmValue}>{slot.label}</span></div>
                  <div className={styles.confirmRow}><span className={styles.confirmLabel}>Where</span><span className={styles.confirmValue}>{p.name} sales office, {p.neighborhood}</span></div>
                  <div className={styles.confirmRow}><span className={styles.confirmLabel}>Apartment</span><span className={styles.confirmValue}>{unit.label} · {unit.sqm} sqm</span></div>
                </div>
                <div className={styles.confirmActions}>
                  <button type="button" className={styles.confirmActionButton}>Add to calendar</button>
                  <button type="button" className={styles.confirmActionButton} onClick={() => { setSlot(null); setStage("slots"); }}>Reschedule</button>
                </div>
              </div>
            </>
          )}
          <div ref={end} />
        </div>

        <div className={styles.composerBar}>
          <button type="button" className={styles.emojiButton} aria-label="Emoji"><SmileIcon size={22} /></button>
          <div className={styles.composerInputWrap}>
            <input
              className={styles.composerInput}
              placeholder={canType ? QUALIFICATION[(stage as { q: number }).q].placeholder : "Type a message"}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button type="button" className={styles.attachIconButton} aria-label="Attach"><PaperclipIcon size={19} /></button>
          </div>
          {draft.trim() ? (
            <button type="button" className={styles.sendCircle} aria-label="Send" onClick={send}><SendIcon size={17} /></button>
          ) : (
            <button type="button" className={styles.sendCircle} aria-label="Voice" disabled><MicIcon size={18} /></button>
          )}
        </div>
      </div>
    </main>
  );
}
