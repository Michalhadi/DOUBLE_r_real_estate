"use client";

import { useMemo, useState } from "react";
import styles from "../_css/admin.module.css";
import { Shell } from "@/components/real-estate/Shell";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { StatusTabs } from "@/components/data/StatusTabs";
import { FilterBar } from "@/components/data/FilterBar";
import { LEADS, STATUS_TONE, type LeadStatus } from "@/lib/real-estate/dashboard-data";

const stars = (n: number) => (n ? "★".repeat(n) + "☆".repeat(5 - n) : "—");
const TABS: ("all" | LeadStatus)[] = ["all", "Booked", "Qualified", "In conversation", "No reply", "Not interested"];
const SOURCES = ["All sources", "Meta", "Google", "Website", "CRM"];

export default function LeadsPage() {
  const [tab, setTab] = useState<"all" | LeadStatus>("all");
  const [source, setSource] = useState("All sources");
  const [search, setSearch] = useState("");
  const rows = useMemo(() => LEADS.filter((l) => (tab === "all" || l.status === tab) && (source === "All sources" || l.source === source) && l.name.toLowerCase().includes(search.trim().toLowerCase())), [tab, source, search]);

  return (
    <Shell activeId="leads">
      <div className={styles.head}>
        <div><h1 className={styles.pageTitle}>Leads</h1><p className={styles.pageSubtitle}>Everyone who asked about a project, across all sources. Every lead keeps its source.</p></div>
      </div>
      <div className={styles.panel}>
        <StatusTabs tabs={TABS.map((t) => ({ id: t, label: t === "all" ? "All" : t, count: t === "all" ? LEADS.length : LEADS.filter((l) => l.status === t).length }))} activeId={tab} onChange={(id) => setTab(id as "all" | LeadStatus)} />
        <FilterBar searchPlaceholder="Search leads" searchValue={search} onSearchChange={setSearch}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{SOURCES.map((s) => (<Chip key={s} active={s === source} onClick={() => setSource(s)}>{s}</Chip>))}</div>
        </FilterBar>
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead><tr><th>Lead</th><th>Project</th><th>Source</th><th>Looking for</th><th>Budget</th><th>Mortgage</th><th>Rating</th><th>Status</th><th>Viewing</th><th>Last activity</th></tr></thead>
            <tbody>
              {rows.map((l) => (
                <tr key={l.id}>
                  <td><div className={styles.person}><span className={styles.personName}>{l.name}</span><span className={styles.personSub}>{l.phone}</span></div></td>
                  <td>{l.project}</td><td className={styles.muted}>{l.source}</td><td className={styles.muted}>{l.purpose}</td><td>{l.budget}</td><td className={styles.muted}>{l.mortgage}</td>
                  <td className={styles.stars}>{stars(l.rating)}</td><td><Badge tone={STATUS_TONE[l.status]}>{l.status}</Badge></td><td className={styles.muted}>{l.viewing ?? "—"}</td><td className={styles.muted}>{l.last}</td>
                </tr>
              ))}
              {rows.length === 0 && (<tr><td colSpan={10} className={styles.muted}>No leads match.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
