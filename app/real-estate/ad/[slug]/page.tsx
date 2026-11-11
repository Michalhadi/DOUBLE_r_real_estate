import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./ad.module.css";
import { Button } from "@/components/ui/Button";
import { RenderArt } from "@/components/real-estate/RenderArt";
import { variantFor } from "@/components/real-estate/parts";
import { REP, getProperty, formatPrice } from "@/lib/real-estate/data";

export default async function PropertyAd({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ cta?: string }>;
}) {
  const { slug } = await params;
  const { cta } = await searchParams;
  const p = getProperty(slug);
  if (!p) notFound();

  return (
    <main className={styles.page}>
      <div className={styles.post}>
        <header className={styles.header}>
          <span className={styles.mark}>{REP.company[0]}</span>
          <div className={styles.headerText}>
            <span className={styles.pageName}>{REP.company}</span>
            <span className={styles.sponsored}>Sponsored</span>
          </div>
        </header>
        <p className={styles.copy}>
          {p.tagline}. {p.name} in {p.neighborhood}, {p.city} — from {formatPrice(p.priceFrom)}. Tap to chat with {REP.name} and find the apartment that fits you.
        </p>
        <div className={styles.media}>
          {p.images ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.images.hero} alt={p.name} className={styles.art} style={{ objectFit: "cover" }} />
          ) : (
            <RenderArt palette={p.palette} variant={variantFor(p)} className={styles.art} />
          )}
          <span className={styles.tag}>{p.status}</span>
          <div className={styles.overlay}>
            <span className={styles.title}>{p.name}</span>
            <span className={styles.sub}>{p.neighborhood}, {p.city} · Delivery {p.delivery}</span>
          </div>
        </div>
        <div className={styles.cta}>
          <div className={styles.ctaText}>
            <span className={styles.ctaTitle}>From {formatPrice(p.priceFrom)}</span>
            <span className={styles.ctaSub}>{p.highlights[0]}</span>
          </div>
          <Link href={cta ?? `/real-estate/project/${p.slug}`}>
            <Button variant="primary">Chat with {REP.name}</Button>
          </Link>
        </div>
        <div className={styles.engagement}>
          <span>👍 342</span><span>💬 57 comments</span><span>↗ 41 shares</span>
        </div>
      </div>
    </main>
  );
}
