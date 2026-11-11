import styles from "./re.module.css";
import { Badge } from "@/components/ui/Badge";
import { RenderArt } from "./RenderArt";
import { REP, type Property, type Unit, formatPrice, priceRange } from "@/lib/real-estate/data";

export const variantFor = (p: Property) =>
  p.slug === "olive-garden" ? "lowrise" : p.slug === "central-lofts" ? "loft" : "tower";

export function RepAvatar({ large }: { large?: boolean }) {
  return (
    <span className={[styles.repAvatar, large && styles.repAvatarLg].filter(Boolean).join(" ")}>
      {REP.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={REP.photo} alt={REP.name} className={styles.repPhoto} />
      ) : (
        REP.initials
      )}
    </span>
  );
}

export function RepBadge() {
  return (
    <div className={styles.rep}>
      <RepAvatar />
      <div className={styles.repText}>
        <span className={styles.repName}>{REP.name}</span>
        <span className={styles.repRole}>{REP.title} · {REP.company}</span>
      </div>
    </div>
  );
}

export function PropertyCard({ p, tall, onClick, cta }: { p: Property; tall?: boolean; onClick?: () => void; cta?: string }) {
  const cls = [styles.art, tall && styles.artTall].filter(Boolean).join(" ");
  return (
    <div className={styles.card}>
      {p.images ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.images.hero} alt={p.name} className={`${cls} ${styles.photo}`} />
      ) : (
        <RenderArt palette={p.palette} variant={variantFor(p)} className={cls} />
      )}
      <div className={styles.body}>
        <Badge tone="brand">{p.status}</Badge>
        <h4 className={styles.name}>{p.name}</h4>
        <p className={styles.meta}>{p.neighborhood}, {p.city} · Delivery {p.delivery}</p>
        <p className={styles.price}>{priceRange(p)}</p>
        {cta && (
          <button type="button" className={styles.suggestBtn} onClick={onClick}>{cta}</button>
        )}
      </div>
    </div>
  );
}

export function UnitCard({ p, u }: { p: Property; u: Unit }) {
  return (
    <div className={styles.card}>
      <RenderArt palette={p.palette} variant="plan" className={styles.art} />
      <div className={styles.body}>
        <h4 className={styles.name}>{u.label} · {u.sqm} sqm</h4>
        <p className={styles.meta}>Floors {u.floor} · {p.name}</p>
        <p className={styles.price}>From {formatPrice(u.priceFrom)}</p>
      </div>
    </div>
  );
}
