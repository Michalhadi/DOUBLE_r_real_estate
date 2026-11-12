import styles from "../_css/admin.module.css";
import { Shell } from "@/components/real-estate/Shell";
import { Badge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/data/MetricCard";
import { SOURCES } from "@/lib/real-estate/dashboard-data";

const URL_BASE = "https://double-r-real-estate.vercel.app/api/leads";

export default function SourcesPage() {
  const total = SOURCES.reduce((n, s) => n + s.leads, 0);
  const booked = SOURCES.reduce((n, s) => n + s.booked, 0);
  const max = Math.max(...SOURCES.map((s) => s.leads));
  return (
    <Shell activeId="sources">
      <div className={styles.head}>
        <div><h1 className={styles.pageTitle}>Sources</h1><p className={styles.pageSubtitle}>Where leads come from, and which source actually books viewings. Every lead keeps its source forever.</p></div>
      </div>
      <div className={styles.kpis} style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <MetricCard label="Leads" value={String(total)} />
        <MetricCard label="Viewings booked" value={String(booked)} footnote={`${Math.round((booked / total) * 100)}% overall`} />
        <MetricCard label="Best source" value="Website" footnote="21% of leads book a viewing" highlight />
      </div>
      <div className={styles.panel}>
        <h2 className={styles.sectionTitle}>By source</h2>
        <div className={styles.bars}>
          {SOURCES.map((s) => (
            <div key={s.source} className={styles.bar}><span>{s.source}</span><div className={styles.barTrack}><div className={styles.barFill} style={{ width: `${(s.leads / max) * 100}%` }} /></div><span className={styles.barNum}>{s.leads} · {Math.round((s.booked / s.leads) * 100)}%</span></div>
          ))}
        </div>
      </div>
      <div className={styles.panel}>
        <h2 className={styles.sectionTitle}>Connect a source</h2>
        <p className={styles.hint}>Each source posts a lead as: name, phone, project, source and consent. The consent field is required before the rep can message anyone on WhatsApp.</p>
        {[["Meta lead forms", "meta"], ["Google lead forms", "google"], ["Website form", "website"], ["CRM / Google Sheet", "crm"]].map(([t, k]) => (
          <div key={k} className={styles.row}>
            <div className={styles.rowText}><span className={styles.rowTitle}>{t}</span><span className={styles.rowSub} style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>POST {URL_BASE}/{k}/&lt;workspace_token&gt;</span></div>
            <Badge tone="success">Connected</Badge>
          </div>
        ))}
      </div>
    </Shell>
  );
}
