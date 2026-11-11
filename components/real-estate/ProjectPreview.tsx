import styles from "./preview.module.css";
import { RenderArt } from "./RenderArt";
import { REP, formatPrice, type Property } from "@/lib/real-estate/data";

/** A live miniature of the buyer-facing project page, built from the form fields. */
export function ProjectPreview({ p, heroSrc }: { p: Property; heroSrc?: string }) {
  const hero = heroSrc ?? p.images?.hero;
  return (
    <div className={styles.phone} aria-label="Live preview">
      <div className={styles.screen}>
        <div className={styles.hero}>
          {hero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero} alt="" className={styles.heroImg} />
          ) : (
            <RenderArt palette={p.palette} variant="night" className={styles.heroImg} />
          )}
          <div className={styles.shade} />
          <div className={styles.heroText}>
            <span className={styles.eyebrow}>{p.type} · {p.city}</span>
            <strong className={styles.title}>{p.name}</strong>
            <span className={styles.tag}>{p.tagline}</span>
            <span className={styles.stats}>From {p.priceFrom ? formatPrice(p.priceFrom) : "—"} · {p.delivery}</span>
            <span className={styles.cta}>🎙 Ask {REP.name} anything</span>
          </div>
        </div>
        <div className={styles.meet}>
          {REP.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={REP.photo} alt={REP.name} className={styles.avatar} />
          )}
          <strong className={styles.hi}>Hi, I&apos;m {REP.name}.</strong>
          <span className={styles.role}>Your AI sales assistant at {p.name}.</span>
          <span className={styles.bubble}>Ask me anything about {p.name}: prices, layouts, payments, the neighborhood.</span>
          <span className={styles.chips}><i>What are the prices?</i><i>Delivery date?</i></span>
        </div>
      </div>
    </div>
  );
}
