"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "../../_css/admin.module.css";
import { Shell } from "@/components/real-estate/Shell";
import { ProjectPreview } from "@/components/real-estate/ProjectPreview";
import { Breadcrumb } from "@/components/nav/Breadcrumb";
import { Stepper } from "@/components/wizard/Stepper";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { answerFor } from "@/lib/real-estate/answers";
import { REP } from "@/lib/real-estate/data";
import { BROCHURE_SAMPLE, EMPTY_FORM, QUAL_QUESTIONS, WIZARD_STEPS, formToProperty, type DraftForm } from "@/lib/real-estate/projects-data";

const TYPES = ["New-build apartments", "Boutique low-rise", "Investment apartments", "Resale listing"].map((v) => ({ value: v, label: v }));

export default function NewProjectPage() {
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [form, setForm] = useState<DraftForm>(EMPTY_FORM);
  const [extracting, setExtracting] = useState(false);
  const [media, setMedia] = useState<{ url: string; name: string }[]>([]);
  const [hero, setHero] = useState(0);
  const [qual, setQual] = useState(Object.fromEntries(QUAL_QUESTIONS.map((q) => [q.id, q.on])));
  const [tone, setTone] = useState("Warm");
  const [lang, setLang] = useState("Auto-detect");
  const [channel, setChannel] = useState("WhatsApp");
  const [viewings, setViewings] = useState(true);
  const [others, setOthers] = useState(true);
  const [chat, setChat] = useState<{ me: boolean; t: string }[]>([]);
  const [q, setQ] = useState("");
  const [published, setPublished] = useState(false);

  const p = useMemo(() => formToProperty(form, "park-residences"), [form]);
  const set = (k: keyof DraftForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function go(n: number) { setStep(n); setFurthest((f) => Math.max(f, n)); }
  function extract() { setExtracting(true); setTimeout(() => { setForm(BROCHURE_SAMPLE); setExtracting(false); }, 1400); }
  function addFiles(files: FileList | null) {
    if (!files) return;
    setMedia((m) => [...m, ...Array.from(files).map((f) => ({ url: URL.createObjectURL(f), name: f.name }))]);
  }
  function ask() {
    if (!q.trim()) return;
    const a = answerFor(p, q);
    setChat((c) => [...c, { me: true, t: q }, { me: false, t: a.text }]);
    setQ("");
  }

  const canNext = step !== 0 || (form.name.trim() && form.city.trim());

  return (
    <Shell activeId="projects">
      <Breadcrumb items={[{ label: "Projects", href: "/real-estate/projects" }, { label: "New project" }]} />
      <div>
        <h1 className={styles.pageTitle}>New project</h1>
        <p className={styles.pageSubtitle}>Fill the fields once. The buyer page, the rep and the link are generated from them — no prompt to write.</p>
      </div>
      <Stepper steps={WIZARD_STEPS} currentIndex={step} furthestIndex={furthest} onStepClick={setStep} />

      <div className={styles.twoCol}>
        <div className={styles.panel}>
          {step === 0 && (
            <>
              <div className={styles.panelHead}><h2 className={styles.sectionTitle}>Project details</h2><Badge tone="brand">Step 1</Badge></div>
              <div className={styles.sheet}>
                <div className={styles.sheetText}><strong>Have a brochure or a price list?</strong><span className={styles.sheetSub}>{extracting ? "Reading the document…" : "Upload it and the fields below fill themselves. Review and edit."}</span></div>
                <Button variant="secondary" onClick={extract} disabled={extracting}>{extracting ? "Extracting…" : "Fill from brochure"}</Button>
              </div>
              <div className={styles.fields}>
                <Input label="Project name" value={form.name} onChange={set("name")} placeholder="Park Residences" />
                <Select label="Type" value={form.type} onChange={set("type")} options={TYPES} />
                <Input label="City" value={form.city} onChange={set("city")} />
                <Input label="Neighborhood" value={form.neighborhood} onChange={set("neighborhood")} />
                <Input label="Price from (₪)" value={form.priceFrom} onChange={set("priceFrom")} inputMode="numeric" />
                <Input label="Price to (₪)" value={form.priceTo} onChange={set("priceTo")} inputMode="numeric" />
                <Input label="Delivery" value={form.delivery} onChange={set("delivery")} placeholder="Q2 2028" />
                <Input label="Tagline" value={form.tagline} onChange={set("tagline")} />
                <div className={styles.fieldFull}><Textarea label="Description" value={form.descr} onChange={set("descr")} /></div>
                <div className={styles.fieldFull}><Input label="Layouts (comma separated, e.g. 3 rooms · 86 sqm)" value={form.units} onChange={set("units")} /></div>
                <div className={styles.fieldFull}><Input label="Highlights (comma separated)" value={form.highlights} onChange={set("highlights")} /></div>
                <div className={styles.fieldFull}><Input label="Amenities (comma separated)" value={form.amenities} onChange={set("amenities")} /></div>
                <div className={styles.fieldFull}><Input label="Payment terms" value={form.paymentTerms} onChange={set("paymentTerms")} /></div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className={styles.panelHead}><h2 className={styles.sectionTitle}>Renderings and photos</h2><Badge tone="brand">Step 2</Badge></div>
              <p className={styles.hint}>The first image is the page hero. The rep sends the rest in the chat when a buyer asks to see the apartment, the building or the floor plan.</p>
              <label className={styles.drop}>
                <strong>Drop images here, or click to choose</strong>
                <span>Renderings, photos, floor plans (JPG or PNG). Video comes next.</span>
                <input type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
              </label>
              {media.length > 0 && (
                <div className={styles.mediaGrid}>
                  {media.map((m, i) => (
                    <button key={m.url} type="button" className={styles.thumb} onClick={() => setHero(i)} style={{ padding: 0, cursor: "pointer", outline: i === hero ? "2px solid var(--brand)" : "none" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.url} alt={m.name} className={styles.thumbImg} />
                      <span className={styles.thumbTag}>{i === hero ? "Hero" : "Gallery"}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div className={styles.panelHead}><h2 className={styles.sectionTitle}>What the rep finds out</h2><Badge tone="brand">Step 3</Badge></div>
              <p className={styles.hint}>The deciding questions come first, in conversation, never as a form. The rep never asks what the buyer already said.</p>
              {QUAL_QUESTIONS.map((x) => (
                <div key={x.id} className={styles.row}>
                  <div className={styles.rowText}><span className={styles.rowTitle}>{x.label}</span><span className={styles.rowSub}>{x.sub}</span></div>
                  <Toggle checked={qual[x.id]} disabled={x.required} onChange={(e) => setQual((s) => ({ ...s, [x.id]: e.target.checked }))} aria-label={x.label} />
                </div>
              ))}
            </>
          )}

          {step === 3 && (
            <>
              <div className={styles.panelHead}><h2 className={styles.sectionTitle}>Rep persona</h2><Badge tone="brand">Step 4</Badge></div>
              <p className={styles.hint}>One persona per company, set once. Every project uses the same base prompt, filled with this project&apos;s fields.</p>
              <Input label="Rep name" defaultValue={REP.name} />
              <div><p className={styles.hint}>Tone</p><SegmentedControl options={["Warm", "Professional", "Direct", "Luxury"]} value={tone} onChange={setTone} /></div>
              <div><p className={styles.hint}>Language</p><SegmentedControl options={["Hebrew", "English", "Auto-detect"]} value={lang} onChange={setLang} /></div>
              <Textarea label="Extra instructions (optional)" placeholder="Anything specific about this project." />
              <p className={styles.hint}>Photo, brand colors and page layout are set once for the whole company in <Link href="/real-estate/rep" style={{ color: "var(--link)" }}>Rep &amp; page design</Link>. Base prompt: <Link href="/real-estate/base-prompt" style={{ color: "var(--link)" }}>review or replace it</Link>.</p>
            </>
          )}

          {step === 4 && (
            <>
              <div className={styles.panelHead}><h2 className={styles.sectionTitle}>Page and channels</h2><Badge tone="brand">Step 5</Badge></div>
              <div><p className={styles.hint}>Channel</p><SegmentedControl options={["WhatsApp", "Web link"]} value={channel} onChange={setChannel} /></div>
              <Select label="Opening template (sent to new leads)" defaultValue="lead_welcome" options={[{ value: "lead_welcome", label: "lead_welcome" }, { value: "lead_reengage", label: "lead_reengage" }]} />
              <Toggle label="Offer a viewing at the end of the conversation" checked={viewings} onChange={(e) => setViewings(e.target.checked)} />
              <Toggle label="Offer other projects when this one isn't a fit" checked={others} onChange={(e) => setOthers(e.target.checked)} />
              <Select label="Lead intake" defaultValue="all" options={[{ value: "all", label: "Meta, Google, website form and CRM" }, { value: "meta", label: "Meta lead forms only" }, { value: "sheet", label: "Google Sheet rows" }]} />
            </>
          )}

          {step === 5 && (
            <>
              <div className={styles.panelHead}><h2 className={styles.sectionTitle}>Test your rep</h2><Badge tone="brand">Step 6</Badge></div>
              <p className={styles.hint}>Talk to {REP.name} as a buyer would. She answers from the fields you just entered.</p>
              <div className={styles.chat}>
                {chat.length === 0 && <div className={styles.chatB}>Ask me anything about {p.name}.</div>}
                {chat.map((m, i) => (<div key={i} className={m.me ? styles.chatM : styles.chatB}>{m.t}</div>))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["What are the prices?", "Delivery date?", "Is there parking?"].map((s) => (<Button key={s} variant="secondary" onClick={() => { const a = answerFor(p, s); setChat((c) => [...c, { me: true, t: s }, { me: false, t: a.text }]); }}>{s}</Button>))}
              </div>
              <div className={styles.inline}>
                <div style={{ flex: 1 }}><Input placeholder="Type a question…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} /></div>
                <Button variant="primary" onClick={ask}>Send</Button>
              </div>
            </>
          )}

          {step === 6 && (
            <>
              {!published ? (
                <div className={styles.success}>
                  <Badge tone="brand">Step 7</Badge>
                  <h2 className={styles.sectionTitle}>Ready to publish {p.name}</h2>
                  <p className={styles.hint}>The buyer page, the rep and the shareable link go live together. Leads from every connected source start flowing in.</p>
                  <Button variant="primary" onClick={() => setPublished(true)}>Publish project</Button>
                </div>
              ) : (
                <div className={styles.success}>
                  <Badge tone="success">Published</Badge>
                  <h2 className={styles.sectionTitle}>{p.name} is live</h2>
                  <div className={styles.linkBox} style={{ width: "100%" }}>https://double-r-real-estate.vercel.app/real-estate/project/{p.slug}?src=meta</div>
                  <div className={styles.qr} />
                  <div className={styles.inline}>
                    <Link href="/real-estate/project/marina-towers"><Button variant="primary">Open the buyer page</Button></Link>
                    <Link href="/real-estate/projects"><Button variant="secondary">Back to projects</Button></Link>
                  </div>
                  <p className={styles.hint}>Demo: in the real product this opens the page just built from your fields.</p>
                </div>
              )}
            </>
          )}

          <div className={styles.wizardBar}>
            <Button variant="ghost" onClick={() => go(Math.max(0, step - 1))} disabled={step === 0}>Back</Button>
            {step < WIZARD_STEPS.length - 1 && <Button variant="primary" onClick={() => go(step + 1)} disabled={!canNext}>Continue</Button>}
          </div>
        </div>

        <div className={styles.panel} style={{ position: "sticky", top: 16 }}>
          <div className={styles.panelHead}><h2 className={styles.sectionTitle}>Live preview</h2><Badge tone="brand">Updates as you type</Badge></div>
          <ProjectPreview p={p} heroSrc={media[hero]?.url} />
          <p className={styles.hint} style={{ textAlign: "center" }}>This is the page your buyers will see.</p>
        </div>
      </div>
    </Shell>
  );
}
