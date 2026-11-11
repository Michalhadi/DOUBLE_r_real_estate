"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "../_css/admin.module.css";
import { Shell } from "@/components/real-estate/Shell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusTabs } from "@/components/data/StatusTabs";
import { PROJECT_ROWS, type ProjectState } from "@/lib/real-estate/projects-data";

const TONE = { Active: "success", Draft: "neutral", Paused: "neutral" } as const;

export default function ProjectsPage() {
  const [tab, setTab] = useState<"all" | ProjectState>("all");
  const rows = tab === "all" ? PROJECT_ROWS : PROJECT_ROWS.filter((r) => r.state === tab);
  const count = (s: ProjectState) => PROJECT_ROWS.filter((r) => r.state === s).length;

  return (
    <Shell activeId="projects">
      <div className={styles.head}>
        <div>
          <h1 className={styles.pageTitle}>Projects</h1>
          <p className={styles.pageSubtitle}>Every project gets its own page, rep and link the moment you publish it.</p>
        </div>
        <Link href="/real-estate/projects/new"><Button variant="primary">New project</Button></Link>
      </div>

      <div className={styles.panel}>
        <StatusTabs
          tabs={[{ id: "all", label: "All", count: PROJECT_ROWS.length }, { id: "Active", label: "Active", count: count("Active") }, { id: "Draft", label: "Draft", count: count("Draft") }, { id: "Paused", label: "Paused", count: count("Paused") }]}
          activeId={tab}
          onChange={(id) => setTab(id as "all" | ProjectState)}
        />
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead><tr><th>Project</th><th>Status</th><th>Leads</th><th>Viewings</th><th>Rate</th><th>Rep</th><th>Channel</th><th>Updated</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.slug}>
                  <td>
                    <Link href={r.state === "Draft" ? "/real-estate/projects/new" : `/real-estate/projects/${r.slug}`} className={styles.person}>
                      <span className={styles.personName}>{r.name}</span>
                      <span className={styles.personSub}>{r.city} · {r.type}</span>
                    </Link>
                  </td>
                  <td><Badge tone={TONE[r.state]}>{r.state}</Badge></td>
                  <td className={styles.muted}>{r.leads}</td>
                  <td className={styles.strong}>{r.booked}</td>
                  <td className={styles.muted}>{r.leads ? `${Math.round((r.booked / r.leads) * 100)}%` : "—"}</td>
                  <td className={styles.muted}>{r.rep}</td>
                  <td className={styles.muted}>{r.channel}</td>
                  <td className={styles.muted}>{r.synced}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
