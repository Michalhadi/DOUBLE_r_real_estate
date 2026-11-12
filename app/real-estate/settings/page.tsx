"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "../_css/admin.module.css";
import { Shell } from "@/components/real-estate/Shell";
import { Tabs } from "@/components/nav/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";

const TABS = ["Google Sheet", "WhatsApp", "Team & workspace"];
const MAP: Record<string, string> = { sheet: "Google Sheet", whatsapp: "WhatsApp", team: "Team & workspace" };

export default function SettingsPage() { return (<Suspense><Settings /></Suspense>); }

function Settings() {
  const qs = useSearchParams();
  const [tab, setTab] = useState(MAP[qs.get("tab") ?? ""] ?? "Google Sheet");
  const active = Object.entries(MAP).find(([, v]) => v === tab)?.[0] ?? "sheet";
  return (
    <Shell activeId={active}>
      <div><h1 className={styles.pageTitle}>Settings</h1><p className={styles.pageSubtitle}>Connections and team for this workspace.</p></div>
      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      {tab === "Google Sheet" && (
        <div className={styles.stack}>
          <div className={styles.panel}>
            <div className={styles.panelHead}><h2 className={styles.sectionTitle}>Lead sheet</h2><Badge tone="neutral">Not connected</Badge></div>
            <p className={styles.hint}>A new row becomes a lead and starts a conversation. When the conversation ends, the same row is updated with status, rating, budget, mortgage, viewing and summary.</p>
            <Input label="Sheet link" placeholder="https://docs.google.com/spreadsheets/d/…" />
            <Select label="Tab" defaultValue="leads" options={[{ value: "leads", label: "Leads" }, { value: "new", label: "Create a new tab" }]} />
            <Button variant="primary">Connect Google Sheet</Button>
          </div>
          <div className={styles.panel}>
            <h2 className={styles.sectionTitle}>Columns</h2>
            <div className={styles.scroll}>
              <table className={styles.table}>
                <thead><tr><th>Column</th><th>Direction</th><th>Notes</th></tr></thead>
                <tbody>
                  {[["name, phone, project, source, consent", "In", "Required. No consent, no message."], ["status, rating", "Out", "Updated after each conversation"], ["budget, mortgage, purpose, timing", "Out", "What the rep found out"], ["viewing", "Out", "Date, time and place"], ["summary", "Out", "Short summary for the sales team"]].map(([c, d, n]) => (<tr key={c}><td>{c}</td><td className={styles.muted}>{d}</td><td className={styles.muted}>{n}</td></tr>))}
                </tbody>
              </table>
            </div>
            <p className={styles.hint}>Other systems (Bambi, Shakal, Nadlan2U) connect through Zapier, a webhook or their API.</p>
          </div>
        </div>
      )}

      {tab === "WhatsApp" && (
        <div className={styles.stack}>
          <div className={styles.panel}>
            <div className={styles.panelHead}><h2 className={styles.sectionTitle}>WhatsApp Business number</h2><Badge tone="success">Connected</Badge></div>
            <div className={styles.fields}><Input label="Number" defaultValue="+972 3 555 0100" readOnly /><Input label="Quality rating" defaultValue="High · Tier 2 (10K / day)" readOnly /></div>
          </div>
          <div className={styles.panel}>
            <h2 className={styles.sectionTitle}>Opening templates</h2>
            {[["lead_welcome", "Approved"], ["lead_reengage", "Pending"]].map(([n, s]) => (<div key={n} className={styles.row}><div className={styles.rowText}><span className={styles.rowTitle}>{n}</span><span className={styles.rowSub}>Hi {"{{1}}"}, you showed interest in {"{{2}}"}. A few quick questions, OK?</span></div><Badge tone={s === "Approved" ? "success" : "neutral"}>{s}</Badge></div>))}
            <p className={styles.hint}>A message to someone who did not write first needs an approved template and recorded consent.</p>
          </div>
        </div>
      )}

      {tab === "Team & workspace" && (
        <div className={styles.stack}>
          <div className={styles.panel}>
            <h2 className={styles.sectionTitle}>Workspace</h2>
            <div className={styles.fields}><Input label="Company" defaultValue="Skyline Developments" /><Input label="Default language" defaultValue="Hebrew" /></div>
          </div>
          <div className={styles.panel}>
            <div className={styles.panelHead}><h2 className={styles.sectionTitle}>Team</h2><Button variant="secondary">Invite teammate</Button></div>
            {[["Michal Regev", "Owner"], ["Amit Shalev", "Sales"], ["Dana R.", "Sales"]].map(([n, r]) => (<div key={n} className={styles.row}><div className={styles.rowText}><span className={styles.rowTitle}>{n}</span><span className={styles.rowSub}>{r}</span></div><Toggle defaultChecked aria-label={`${n} receives viewing alerts`} label="Viewing alerts" /></div>))}
          </div>
        </div>
      )}
    </Shell>
  );
}
