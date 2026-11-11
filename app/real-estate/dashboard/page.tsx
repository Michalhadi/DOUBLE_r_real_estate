"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./dashboard.module.css";
import { Sidebar } from "@/components/nav/Sidebar";
import { Topbar } from "@/components/nav/Topbar";
import { MetricCard } from "@/components/data/MetricCard";
import { TrendChart } from "@/components/data/TrendChart";
import { StatusTabs } from "@/components/data/StatusTabs";
import { SetupChecklist, type ChecklistStep } from "@/components/dashboard/SetupChecklist";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RE_NAV } from "@/lib/real-estate/nav";
import { REP } from "@/lib/real-estate/data";
import { LEADS, PROJECT_FUNNEL, SOURCES, STATUS_TONE, TREND_POINTS, type LeadStatus } from "@/lib/real-estate/dashboard-data";

const STEPS: ChecklistStep[] = [
  { label: "Verify your email", description: "Confirm your email so we can send you important updates.", done: true },
  { label: "Create your sales rep", description: "Name, photo, tone and brand colors, shown on every project page.", done: true, href: "/real-estate/agent" },
  { label: "Connect a WhatsApp Business number", description: "Link your Meta account to message leads who opted in.", done: true },
  { label: "Add your first project", description: "Fields, price list, renderings and floor plans.", done: true, href: "/real-estate/projects/new" },
  { label: "Connect your Google Sheet", description: "New rows become leads. Results are written back to the same sheet.", done: false, href: "#" },
  { label: "Copy your lead-form webhook", description: "Paste it into Meta, Google or your website form.", done: false, href: "#" },
];

const TABS: { id: "all" | LeadStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Booked", label: "Booked" },
  { id: "Qualified", label: "Qualified" },
  { id: "In conversation", label: "In conversation" },
  { id: "No reply", label: "No reply" },
];

const stars = (n: number) => (n ? "★".repeat(n) + "☆".repeat(5 - n) : "—");
const pct = (a: number, b: number) => `${Math.round((a / b) * 100)}%`;

export default function RealEstateDashboard() {
  const [tab, setTab] = useState<"all" | LeadStatus>("all");
  const [range, setRange] = useState<"today" | "7d" | "30d">("7d");

  const rows = useMemo(() => (tab === "all" ? LEADS : LEADS.filter((l) => l.status === tab)), [tab]);
  const tabs = TABS.map((t) => ({ ...t, count: t.id === "all" ? LEADS.length : LEADS.filter((l) => l.status === t.id).length }));
  const maxSource = Math.max(...SOURCES.map((s) => s.leads));

  return (
    <div className={styles.shell}>
      <Sidebar items={RE_NAV} activeId="dashboard" brand="Double R Estate" />
      <div className={styles.main}>
        <Topbar userName="Michal Regev" />
        <div className={styles.content}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
            <div>
              <h1 className={styles.pageTitle}>Dashboard</h1>
              <p className={styles.pageSubtitle}>Skyline Developments · leads, viewings and sources at a glance.</p>
            </div>
            <div role="group" aria-label="Range" style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <Link href="/real-estate/projects/new"><Button variant="primary">New project</Button></Link>
              {([["today", "Today"], ["7d", "7 days"], ["30d", "30 days"]] as const).map(([id, label]) => (
                <Button key={id} variant={range === id ? "primary" : "secondary"} onClick={() => setRange(id)}>{label}</Button>
              ))}
            </div>
          </div>

          <SetupChecklist steps={STEPS} />

          <div className={styles.sheet}>
            <div className={styles.repRow}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {REP.photo && <img src={REP.photo} alt={REP.name} className={styles.repPhoto} />}
            </div>
            <div className={styles.sheetText}>
              <strong>{REP.name} is live on 3 projects</strong>
              <span className={styles.sheetSub}>AI sales assistant · answering on WhatsApp and on project pages · 24 conversations right now</span>
            </div>
            <span className={styles.live}><i /> Online</span>
            <Link href="/real-estate/agent"><Button variant="secondary">Open rep</Button></Link>
          </div>

          <div className={styles.kpis}>
            <MetricCard label="New leads" value={range === "today" ? "38" : range === "7d" ? "896" : "3,412"} change={{ direction: "up", value: "18% vs previous" }} />
            <MetricCard label="Viewings booked" value={range === "today" ? "9" : range === "7d" ? "153" : "571"} change={{ direction: "up", value: "24% vs previous" }} />
            <MetricCard label="Qualification rate" value="64%" footnote="of leads finished the conversation with budget and timing" />
            <MetricCard label="Time to viewing · median" value="1.1" unit="days" footnote="vs 6 days with manual call-backs" highlight />
          </div>

          <div className={styles.grid}>
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <span className={styles.panelTitle}>Projects</span>
                <span className={styles.panelHint}>Entered · Qualified · Booked</span>
              </div>
              <div className={styles.scroll}>
                <table className={styles.table}>
                  <thead>
                    <tr><th>Project</th><th>Status</th><th>Entered</th><th>Qualified</th><th>Booked</th><th>Booking rate</th><th>Time to viewing</th></tr>
                  </thead>
                  <tbody>
                    {PROJECT_FUNNEL.map((p) => (
                      <tr key={p.slug}>
                        <td>
                          <Link href={`/real-estate/projects/${p.slug}`} className={styles.person}>
                            <span className={styles.personName}>{p.name}</span>
                            <span className={styles.personSub}>{p.city}</span>
                          </Link>
                        </td>
                        <td><Badge tone="success">{p.status}</Badge></td>
                        <td className={styles.muted}>{p.entered}</td>
                        <td className={styles.muted}>{p.qualified}</td>
                        <td className={styles.strong}>{p.booked}</td>
                        <td className={styles.muted}>{pct(p.booked, p.entered)}</td>
                        <td className={styles.muted}>{p.timeToViewing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <TrendChart
              label="Time to viewing"
              value="1.1"
              unit="days"
              changeLabel="73% in 6 weeks"
              points={TREND_POINTS}
              caption="The rep answers in seconds, qualifies in one conversation and books the viewing in the same chat. Leads reach a sales meeting in about a day, not a week."
            />
          </div>

          <div className={styles.panel} id="sources">
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>Lead sources</span>
              <span className={styles.panelHint}>Leads · booked viewings</span>
            </div>
            <div className={styles.bars}>
              {SOURCES.map((s) => (
                <div key={s.source} className={styles.bar}>
                  <span>{s.source}</span>
                  <div className={styles.barTrack}><div className={styles.barFill} style={{ width: `${(s.leads / maxSource) * 100}%` }} /></div>
                  <span className={styles.barNum}>{s.leads} · {s.booked} booked</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.panel} id="leads">
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>Leads</span>
              <span className={styles.panelHint}>Synced with Google Sheet · every conversation keeps its source</span>
            </div>
            <StatusTabs tabs={tabs} activeId={tab} onChange={(id) => setTab(id as "all" | LeadStatus)} />
            <div className={styles.scroll}>
              <table className={styles.table}>
                <thead>
                  <tr><th>Lead</th><th>Project</th><th>Source</th><th>Looking for</th><th>Budget</th><th>Mortgage</th><th>Rating</th><th>Status</th><th>Viewing</th><th>Last activity</th></tr>
                </thead>
                <tbody>
                  {rows.map((l) => (
                    <tr key={l.id}>
                      <td><div className={styles.person}><span className={styles.personName}>{l.name}</span><span className={styles.personSub}>{l.phone}</span></div></td>
                      <td>{l.project}</td>
                      <td className={styles.muted}>{l.source}</td>
                      <td className={styles.muted}>{l.purpose}</td>
                      <td>{l.budget}</td>
                      <td className={styles.muted}>{l.mortgage}</td>
                      <td className={styles.stars}>{stars(l.rating)}</td>
                      <td><Badge tone={STATUS_TONE[l.status]}>{l.status}</Badge></td>
                      <td className={styles.muted}>{l.viewing ?? "—"}</td>
                      <td className={styles.muted}>{l.last}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
