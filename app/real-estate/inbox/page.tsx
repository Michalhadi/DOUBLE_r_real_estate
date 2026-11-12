"use client";

import { useState } from "react";
import styles from "../_css/admin.module.css";
import inbox from "./inbox.module.css";
import { Shell } from "@/components/real-estate/Shell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LEADS, STATUS_TONE, type Lead } from "@/lib/real-estate/dashboard-data";
import { REP } from "@/lib/real-estate/data";

function thread(l: Lead): { me: boolean; t: string }[] {
  const m = [
    { me: false, t: `Hi ${l.name.split(" ")[0]} 👋 You showed interest in ${l.project}. I'm ${REP.name} from ${REP.company}. Can I ask you a few quick questions?` },
    { me: true, t: "Yes, sure." },
    { me: false, t: "Great! Is this for your own home, or an investment?" },
    { me: true, t: l.purpose === "Home" ? "For us to live in." : "An investment." },
  ];
  if (l.budget !== "—") m.push({ me: false, t: "Does a budget around the starting price work for you?" }, { me: true, t: `We're looking at up to ${l.budget}.` });
  if (l.viewing) m.push({ me: false, t: `Perfect. I booked you for ${l.viewing}. A confirmation is on its way.` });
  return m;
}

export default function InboxPage() {
  const [id, setId] = useState(LEADS[0].id);
  const lead = LEADS.find((l) => l.id === id)!;
  return (
    <Shell activeId="inbox">
      <div className={styles.head}>
        <div><h1 className={styles.pageTitle}>Inbox</h1><p className={styles.pageSubtitle}>Every conversation the rep is having, on WhatsApp and on project pages. Take over any time.</p></div>
      </div>
      <div className={inbox.wrap}>
        <div className={inbox.list}>
          {LEADS.map((l) => (
            <button key={l.id} type="button" className={[inbox.item, l.id === id && inbox.active].filter(Boolean).join(" ")} onClick={() => setId(l.id)}>
              <span className={styles.personName}>{l.name}</span>
              <span className={styles.personSub}>{l.project} · {l.source}</span>
              <span className={inbox.meta}><Badge tone={STATUS_TONE[l.status]}>{l.status}</Badge><i>{l.last}</i></span>
            </button>
          ))}
        </div>
        <div className={inbox.thread}>
          <div className={inbox.threadHead}>
            <div className={styles.person}><span className={styles.personName}>{lead.name}</span><span className={styles.personSub}>{lead.phone} · {lead.project}</span></div>
            <Badge tone="brand">{REP.name} is handling this</Badge>
          </div>
          <div className={styles.chat} style={{ maxHeight: "none", flex: 1, padding: 16 }}>
            {thread(lead).map((m, i) => (<div key={i} className={m.me ? styles.chatB : styles.chatM}>{m.t}</div>))}
          </div>
          <div className={inbox.composer}>
            <span className={styles.hint}>Replies are sent by {REP.name}. Take over to write yourself.</span>
            <Button variant="secondary">Take over</Button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
