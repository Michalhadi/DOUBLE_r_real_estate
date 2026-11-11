"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./project.module.css";
import { RenderArt } from "@/components/real-estate/RenderArt";
import { REP, VIEWING_SLOTS, formatPrice, getProperty } from "@/lib/real-estate/data";
import { answerFor, SUGGESTED } from "@/lib/real-estate/answers";

type Msg = { from: "bot" | "me"; text: string; booking?: boolean; image?: string; animate?: boolean };

/** Types the text out character by character, then reveals the extras. */
function BotContent({ m, onTick, children }: { m: Msg; onTick: () => void; children: React.ReactNode }) {
  const [n, setN] = useState(m.animate ? 0 : m.text.length);
  const done = n >= m.text.length;
  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setN((v) => v + 1), 18);
    return () => clearTimeout(t);
  }, [n, done]);
  useEffect(() => { onTick(); }, [n, done, onTick]);
  return (
    <>
      {m.image && done && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.image} alt="" className={styles.shot} />
      )}
      {m.text.slice(0, n)}
      {!done && <span className={styles.caret} />}
      {done && children}
    </>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function getRecognition(): any | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
  return SR ? new SR() : null;
}

export function ProjectLanding({ slug }: { slug: string }) {
  const p = getProperty(slug)!;
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", animate: true, text: `Ask me anything about ${p.name}: prices, layouts, payments, the neighborhood. You can type, or just talk.` },
  ]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [booked, setBooked] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const scrollDown = useCallback(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);
  useEffect(() => { scrollDown(); }, [msgs, typing, booked, scrollDown]);

  const gallery = [
    p.images
      ? { src: p.images.gallery[0], label: "Inside", q: "Show me inside" }
      : { art: "loft" as const, label: "Inside", q: "Show me the layouts" },
    { art: "plan" as const, label: "Floor plans", q: "Show me the layouts" },
    p.images
      ? { src: p.images.hero, label: "The building", q: `Tell me about ${p.neighborhood}` }
      : { art: "night" as const, label: "The building", q: `Tell me about ${p.neighborhood}` },
  ];

  function send(text: string, spoken = false) {
    const q = text.trim();
    if (!q) return;
    setDraft("");
    setMsgs((m) => [...m, { from: "me", text: q }]);
    setTyping(true);
    const a = answerFor(p, q);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "bot", animate: true, text: a.text, booking: a.offerBooking, image: a.image }]);
      if (spoken && typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(a.text));
      }
    }, 700);
  }

  function talk() {
    const rec = getRecognition();
    if (!rec) {
      setMsgs((m) => [...m, { from: "bot", text: "Voice isn't supported in this browser. Try Chrome or Safari, or type your question." }]);
      return;
    }
    if (listening) { rec.stop(); setListening(false); return; }
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (e: any) => send(e.results[0][0].transcript, true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true);
    rec.start();
  }

  const goChat = () => {
    chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 600);
  };

  return (
    <main className={styles.page} style={{ ["--accent" as string]: p.palette.accent }}>
      <section className={styles.hero}>
        {p.images ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.images.hero} alt="" className={styles.heroArt} />
        ) : (
          <RenderArt palette={p.palette} variant="night" className={styles.heroArt} />
        )}
        <div className={styles.heroShade} />
        <header className={styles.top}>
          <span className={styles.brand}>{REP.company.toUpperCase()}</span>
          <button type="button" className={styles.topLink} onClick={goChat}>Talk to {REP.name}</button>
        </header>
        <div className={styles.heroText}>
          <span className={styles.status}>{p.type} · {p.city}</span>
          <h1 className={styles.title}>{p.name}</h1>
          <p className={styles.tagline}>{p.tagline}</p>
          <dl className={styles.stats}>
            <div><dt>From</dt><dd>{formatPrice(p.priceFrom)}</dd></div>
            <div><dt>Delivery</dt><dd>{p.delivery}</dd></div>
            <div><dt>Layouts</dt><dd>{p.units.length}</dd></div>
          </dl>
          <button type="button" className={styles.cta} onClick={goChat}>
            <span className={styles.ctaMic}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
            </span>
            <span className={styles.ctaText}>
              <strong>Ask {REP.name} anything</strong>
              <small>Our AI sales assistant · type or talk</small>
            </span>
            <span aria-hidden>↓</span>
          </button>
        </div>
      </section>

      <section className={styles.meet} ref={chatRef} aria-label={`Talk to ${REP.name}`}>
        <div className={styles.meetGrid}>
          <div className={styles.portrait}>
            {REP.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={REP.photo} alt={REP.name} className={styles.portraitImg} />
            ) : (
              <span className={styles.portraitFallback}>{REP.initials}</span>
            )}
            <span className={styles.live}><i /> AI sales assistant · online</span>
          </div>

          <div className={styles.talkCol}>
            <h2 className={styles.hi}>Hi, I&apos;m {REP.name}.</h2>
            <p className={styles.role}>Your AI sales assistant at {p.name}.</p>

            <div className={styles.thread} ref={threadRef}>
              {msgs.map((m, i) => (
                <div key={i} className={[styles.row, m.from === "me" && styles.rowMe].filter(Boolean).join(" ")}>
                  <div className={[styles.bubble, m.from === "me" ? styles.me : styles.bot].join(" ")}>
                    {m.from === "bot" ? (
                      <BotContent m={m} onTick={scrollDown}>
                        {m.booking && !booked && (
                          <div className={styles.slots}>
                            {VIEWING_SLOTS.map((sl) => (
                              <button key={sl.iso} type="button" className={styles.slot} onClick={() => setBooked(sl.label)}>{sl.label}</button>
                            ))}
                          </div>
                        )}
                      </BotContent>
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              ))}
              {msgs.length === 1 && !typing && (
                <div className={styles.gallery} aria-label={`${p.name} gallery`}>
                  {gallery.map((g) => (
                    <button key={g.label} type="button" className={styles.tile} onClick={() => send(g.q)}>
                      {"src" in g ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={g.src} alt="" className={styles.tileImg} />
                      ) : (
                        <RenderArt palette={p.palette} variant={g.art} className={styles.tileImg} />
                      )}
                      <span className={styles.tileLabel}>{g.label}</span>
                    </button>
                  ))}
                </div>
              )}
              {typing && <div className={styles.row}><div className={[styles.bubble, styles.bot, styles.typing].join(" ")}><i /><i /><i /></div></div>}
              {booked && (
                <div className={styles.done}>
                  <strong>Viewing booked</strong>
                  <span>{booked} · {p.name} sales office, {p.neighborhood}</span>
                  <span>{REP.name} will send the confirmation on WhatsApp.</span>
                </div>
              )}
            </div>

            <div className={styles.chips}>
              {SUGGESTED(p).map((s) => (
                <button key={s} type="button" className={styles.chip} onClick={() => send(s)}>{s}</button>
              ))}
            </div>

            <form className={styles.composer} onSubmit={(e) => { e.preventDefault(); send(draft); }}>
              <button type="button" className={[styles.talk, listening && styles.talkOn].filter(Boolean).join(" ")} onClick={talk} aria-pressed={listening} aria-label={`Talk to ${REP.name}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
              </button>
              <input
                ref={inputRef}
                className={styles.input}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={listening ? "Listening…" : "Type a question…"}
                aria-label={`Message ${REP.name}`}
              />
              <button type="submit" className={styles.send} disabled={!draft.trim()}>Send</button>
            </form>
            <p className={styles.talkHint}>
              {listening ? `${REP.name} is listening…` : `Tap the mic and talk to ${REP.name} out loud. She answers in voice.`}
            </p>
          </div>
        </div>
      </section>

      <footer className={styles.foot}>Renderings and plans are for illustration only. {REP.name} is an AI assistant; a member of our sales team will meet you at the viewing.</footer>
    </main>
  );
}
