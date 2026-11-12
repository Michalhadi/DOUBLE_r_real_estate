"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./properties.module.css";
import { RenderArt } from "@/components/real-estate/RenderArt";
import { variantFor } from "@/components/real-estate/parts";
import { PROPERTIES, REP, formatPrice } from "@/lib/real-estate/data";
import { fill, useTheme } from "@/lib/real-estate/theme";

const CITIES = ["All", ...Array.from(new Set(PROPERTIES.map((p) => p.city)))];
const TYPES = ["All", ...Array.from(new Set(PROPERTIES.map((p) => p.type)))];

export function PropertiesClient() {
  const theme = useTheme();
  const L = theme.list;
  const repName = theme.repName;
  const repPhoto = theme.repPhoto ?? REP.photo;
  const [city, setCity] = useState("All");
  const [type, setType] = useState("All");

  const list = useMemo(
    () => PROPERTIES.filter((p) => (city === "All" || p.city === city) && (type === "All" || p.type === type)),
    [city, type],
  );

  return (
    <main className={styles.page} data-tone={theme.page.tone} data-font={theme.page.font} data-cards={L.layout} data-style={L.cardStyle} style={{ ["--accent" as string]: theme.page.accent }}>
      <header className={styles.hero}>
        <div className={styles.top}>
          <span className={styles.brand}>{theme.page.company.toUpperCase()}</span>
          <Link href="/real-estate/agent" className={styles.topLink}>Talk to {repName}</Link>
        </div>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>{PROPERTIES.length} projects · {PROPERTIES.reduce((n, p) => n + p.units.length, 0)} apartment types</span>
          <h1 className={styles.title}>{L.headline}</h1>
          <p className={styles.sub}>{fill(L.sub, repName)}</p>
        </div>
      </header>

      {L.showRep && (
      <section className={styles.dana}>
        <div className={styles.danaInner}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {repPhoto && <img src={repPhoto} alt={repName} className={styles.danaPhoto} />}
          <div className={styles.danaText}>
            <strong>Not sure which project fits? Ask {repName}.</strong>
            <span>Our AI sales assistant knows every project. Type or talk, she answers right away.</span>
          </div>
          <Link href="/real-estate/agent" className={styles.danaBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
            Ask {repName}
          </Link>
        </div>
      </section>
      )}

      <section className={styles.listing}>
        <div className={styles.filters} aria-label="Filters">
          {L.filterCity && <div className={styles.group}>
            <span className={styles.label}>City</span>
            {CITIES.map((c) => (
              <button key={c} type="button" className={[styles.pill, c === city && styles.pillOn].filter(Boolean).join(" ")} onClick={() => setCity(c)}>{c}</button>
            ))}
          </div>}
          {L.filterType && <div className={styles.group}>
            <span className={styles.label}>Type</span>
            {TYPES.map((t) => (
              <button key={t} type="button" className={[styles.pill, t === type && styles.pillOn].filter(Boolean).join(" ")} onClick={() => setType(t)}>{t}</button>
            ))}
          </div>}
        </div>

        {list.length === 0 ? (
          <p className={styles.empty}>No projects match. <button type="button" className={styles.link} onClick={() => { setCity("All"); setType("All"); }}>Clear filters</button></p>
        ) : (
          <div className={styles.grid}>
            {list.map((p) => (
              <article key={p.slug} className={styles.card}>
                <Link href={`/real-estate/project/${p.slug}`} className={styles.media}>
                  {p.images ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images.hero} alt={p.name} className={styles.img} />
                  ) : (
                    <RenderArt palette={p.palette} variant={variantFor(p)} className={styles.img} />
                  )}
                  <span className={styles.status}>{p.status}</span>
                </Link>
                <div className={styles.body}>
                  <span className={styles.where}>{p.neighborhood}, {p.city}</span>
                  <h2 className={styles.name}>{p.name}</h2>
                  <p className={styles.tag}>{p.tagline}</p>
                  <dl className={styles.facts}>
                    <div><dt>From</dt><dd>{formatPrice(p.priceFrom)}</dd></div>
                    <div><dt>Delivery</dt><dd>{p.delivery}</dd></div>
                    <div><dt>Layouts</dt><dd>{p.units.length}</dd></div>
                  </dl>
                  <div className={styles.actions}>
                    <Link href={`/real-estate/project/${p.slug}`} className={styles.primary}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {repPhoto && <img src={repPhoto} alt="" className={styles.mini} />}
                      Chat with {repName}
                    </Link>
                    <Link href={`/real-estate/project/${p.slug}`} className={styles.ghost}>View project</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className={styles.foot}>Renderings and plans are for illustration only. {repName} is an AI assistant; a member of our sales team will meet you at the viewing.</footer>
    </main>
  );
}
