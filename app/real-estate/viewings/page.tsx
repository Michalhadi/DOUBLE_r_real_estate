import styles from "../_css/admin.module.css";
import { Shell } from "@/components/real-estate/Shell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/data/MetricCard";
import { LEADS } from "@/lib/real-estate/dashboard-data";

export default function ViewingsPage() {
  const booked = LEADS.filter((l) => l.viewing);
  const days = Array.from(new Set(booked.map((l) => l.viewing!.split(" · ")[0])));
  return (
    <Shell activeId="viewings">
      <div className={styles.head}>
        <div><h1 className={styles.pageTitle}>Viewings</h1><p className={styles.pageSubtitle}>Viewings the rep booked, with the lead&apos;s summary ready for the sales team.</p></div>
        <Badge tone="success">Calendar connected</Badge>
      </div>
      <div className={styles.kpis} style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <MetricCard label="Upcoming" value={String(booked.length)} />
        <MetricCard label="This week" value="21" change={{ direction: "up", value: "24% vs last week" }} />
        <MetricCard label="Show-up rate" value="78%" footnote="with a reminder the day before" />
      </div>
      {days.map((day) => (
        <div className={styles.panel} key={day}>
          <h2 className={styles.sectionTitle}>{day}</h2>
          {booked.filter((l) => l.viewing!.startsWith(day)).map((l) => (
            <div className={styles.row} key={l.id}>
              <div className={styles.rowText}>
                <span className={styles.rowTitle}>{l.viewing!.split(" · ")[1]} · {l.name}</span>
                <span className={styles.rowSub}>{l.project} · {l.purpose} · budget {l.budget} · {l.mortgage}</span>
              </div>
              <div className={styles.inline}><Badge tone="success">Confirmed</Badge><Button variant="secondary">Reschedule</Button><Button variant="ghost">Cancel</Button></div>
            </div>
          ))}
        </div>
      ))}
    </Shell>
  );
}
