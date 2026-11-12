"use client";

import { useState } from "react";
import styles from "../_css/admin.module.css";
import { Shell } from "@/components/real-estate/Shell";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { RenderArt } from "@/components/real-estate/RenderArt";
import { PROPERTIES } from "@/lib/real-estate/data";

type Item = { id: string; project: string; kind: "Rendering" | "Photo" | "Floor plan" | "Video"; name: string; src?: string; art?: "tower" | "lowrise" | "loft" | "plan" | "night"; used: number };

const ITEMS: Item[] = [
  { id: "1", project: "Marina Towers", kind: "Rendering", name: "Exterior at dusk", src: "/real-estate/marina-hero.webp", used: 214 },
  { id: "2", project: "Marina Towers", kind: "Photo", name: "Living room", src: "/real-estate/marina-interior.png", used: 168 },
  { id: "3", project: "Marina Towers", kind: "Floor plan", name: "4 rooms · 112 sqm", art: "plan", used: 133 },
  { id: "4", project: "Olive Garden Residences", kind: "Rendering", name: "Courtyard", art: "lowrise", used: 61 },
  { id: "5", project: "Olive Garden Residences", kind: "Floor plan", name: "5 rooms · roof", art: "plan", used: 40 },
  { id: "6", project: "Central Lofts", kind: "Rendering", name: "Street view", art: "loft", used: 72 },
  { id: "7", project: "Central Lofts", kind: "Floor plan", name: "Studio · 38 sqm", art: "plan", used: 55 },
];
const KINDS = ["All", "Rendering", "Photo", "Floor plan", "Video"];

export default function MediaPage() {
  const [project, setProject] = useState("All projects");
  const [kind, setKind] = useState("All");
  const rows = ITEMS.filter((i) => (project === "All projects" || i.project === project) && (kind === "All" || i.kind === kind));
  return (
    <Shell activeId="media">
      <div className={styles.head}>
        <div><h1 className={styles.pageTitle}>Media library</h1><p className={styles.pageSubtitle}>Renderings, photos, floor plans and video. The rep sends the right one when a buyer asks.</p></div>
        <label className={styles.drop} style={{ padding: "10px 20px" }}><strong>+ Upload media</strong><input type="file" accept="image/*,video/*" multiple hidden /></label>
      </div>
      <div className={styles.sheet}>
        <div className={styles.sheetText}><strong>1.2 GB of 10 GB used</strong><span className={styles.sheetSub}>Large video is compressed for WhatsApp automatically.</span></div>
        <div style={{ width: 200 }} className={styles.barTrack}><div className={styles.barFill} style={{ width: "12%" }} /></div>
      </div>
      <div className={styles.panel}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["All projects", ...PROPERTIES.map((p) => p.name)].map((p) => (<Chip key={p} active={p === project} onClick={() => setProject(p)}>{p}</Chip>))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{KINDS.map((k) => (<Chip key={k} active={k === kind} onClick={() => setKind(k)}>{k}</Chip>))}</div>
        <div className={styles.mediaGrid} style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
          {rows.map((i) => (
            <div key={i.id} className={styles.panel} style={{ padding: 0, overflow: "hidden", gap: 0 }}>
              <div className={styles.thumb} style={{ borderRadius: 0, border: 0 }}>
                {i.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={i.src} alt={i.name} className={styles.thumbImg} />
                ) : (
                  <RenderArt palette={PROPERTIES[0].palette} variant={i.art!} className={styles.thumbImg} />
                )}
              </div>
              <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 4 }}>
                <span className={styles.rowTitle}>{i.name}</span>
                <span className={styles.rowSub}>{i.project}</span>
                <div className={styles.inline} style={{ justifyContent: "space-between", alignItems: "center" }}><Badge tone="neutral">{i.kind}</Badge><span className={styles.hint}>sent {i.used}×</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
