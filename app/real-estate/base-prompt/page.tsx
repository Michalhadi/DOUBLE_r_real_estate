"use client";

import { useState } from "react";
import styles from "../_css/admin.module.css";
import { Shell } from "@/components/real-estate/Shell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { DEFAULT_BASE_PROMPT, PLACEHOLDERS, renderPrompt } from "@/lib/real-estate/base-prompt";
import { PROPERTIES, REP } from "@/lib/real-estate/data";

export default function BasePromptPage() {
  const [text, setText] = useState(DEFAULT_BASE_PROMPT);
  const [slug, setSlug] = useState(PROPERTIES[0].slug);
  const [saved, setSaved] = useState(false);
  const p = PROPERTIES.find((x) => x.slug === slug)!;

  return (
    <Shell activeId="prompt">
      <div className={styles.head}>
        <div>
          <div className={styles.titleRow}>
            <h1 className={styles.pageTitle}>Base prompt</h1>
            <Badge tone="neutral">Draft — review before going live</Badge>
          </div>
          <p className={styles.pageSubtitle}>One prompt for every project and every rep. The placeholders turn it into a specific agent. Nobody writes a prompt per project.</p>
        </div>
        <div className={styles.inline}>
          <Button variant="ghost" onClick={() => { setText(DEFAULT_BASE_PROMPT); setSaved(false); }}>Reset to default</Button>
          <Button variant="primary" onClick={() => setSaved(true)}>{saved ? "Saved" : "Save"}</Button>
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.panel}>
          <h2 className={styles.sectionTitle}>Template</h2>
          <p className={styles.hint}>Click a placeholder to insert it at the end. Paste the agency&apos;s own prompt here to replace the draft.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {PLACEHOLDERS.map((ph) => (
              <button key={ph} type="button" className={styles.var} style={{ border: 0, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }} onClick={() => { setText((t) => `${t} {{${ph}}}`); setSaved(false); }}>{`{{${ph}}}`}</button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setSaved(false); }}
            className={styles.promptBox}
            style={{ minHeight: 560, width: "100%", resize: "vertical" }}
            aria-label="Base prompt"
          />
        </div>

        <div className={styles.panel}>
          <h2 className={styles.sectionTitle}>Live preview</h2>
          <Select label="Render against project" value={slug} onChange={(e) => setSlug(e.target.value)} options={PROPERTIES.map((x) => ({ value: x.slug, label: x.name }))} />
          <div className={styles.promptBox}>
            {renderPrompt(text, p, REP).map((s, i) => (s.v ? <span key={i} className={styles.var}>{s.text}</span> : <span key={i}>{s.text}</span>))}
          </div>
          <p className={styles.hint}>Highlighted text is filled from the project fields.</p>
        </div>
      </div>
    </Shell>
  );
}
