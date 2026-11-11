"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "../../_css/admin.module.css";
import { Shell } from "@/components/real-estate/Shell";
import { ProjectPreview } from "@/components/real-estate/ProjectPreview";
import { Breadcrumb } from "@/components/nav/Breadcrumb";
import { Tabs } from "@/components/nav/Tabs";
import { MetricCard } from "@/components/data/MetricCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { DEFAULT_BASE_PROMPT, renderPrompt } from "@/lib/real-estate/base-prompt";
import { answerFor } from "@/lib/real-estate/answers";
import { REP, VIEWING_SLOTS, formatPrice, getProperty } from "@/lib/real-estate/data";
import { LEADS, PROJECT_FUNNEL, STATUS_TONE } from "@/lib/real-estate/dashboard-data";

const TABS = ["Overview", "Rep", "Calendar", "Leads", "Viewings", "Analytics", "Channels", "Settings"];
const stars = (n: number) => (n ? "★".repeat(n) + "☆".repeat(5 - n) : "—");

export function Workspace({ slug }: { slug: string }) {
  const p = getProperty(slug)!;
  const funnel = PROJECT_FUNNEL.find((f) => f.slug === slug)!;
  const leads = LEADS.filter((l) => l.project === p.name);
  const [tab, setTab] = useState("Overview");
  const [tone, setTone] = useState("Warm");
  const [lang, setLang] = useState("Auto-detect");
  const [length, setLength] = useState("Short");
  const [state, setState] = useState("Active");
  const [channel, setChannel] = useState("WhatsApp");
  const [viewings, setViewings] = useState(true);
  const [others, setOthers] = useState(true);
  const [chat, setChat] = useState<{ me: boolean; t: string }[]>([{ me: false, t: `Ask me anything about ${p.name}.` }]);
  const [q, setQ] = useState("");
  const link = `https://double-r-real-estate.vercel.app/real-estate/project/${p.slug}`;

  function ask() {
    if (!q.trim()) return;
    const a = answerFor(p, q);
    setChat((c) => [...c, { me: true, t: q }, { me: false, t: a.text }]);
    setQ("");
  }

  return (
    <Shell activeId="projects">
      <Breadcrumb items={[{ label: "Projects", href: "/real-estate/projects" }, { label: p.name }]} />
      <div>
        <div className={styles.titleRow}>
          <h1 className={styles.pageTitle}>{p.name}</h1>
          <Badge tone="success">{state}</Badge>
        </div>
        <p className={styles.pageSubtitle}>{p.type} · {p.neighborhood}, {p.city} · Delivery {p.delivery}</p>
        <p className={styles.pageSubtitle}>
          <Link href={`/real-estate/project/${p.slug}`} style={{ color: "var(--link)" }}>Open the buyer page ↗</Link>
          {" · "}
          <Link href="/real-estate/properties" style={{ color: "var(--link)" }}>See all projects</Link>
        </p>
      </div>
      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      {tab === "Overview" && (
        <>
          <div className={styles.kpis} style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <MetricCard label="Leads" value={String(funnel.entered)} />
            <MetricCard label="Viewings booked" value={String(funnel.booked)} footnote={`${Math.round((funnel.booked / funnel.entered) * 100)}% of leads`} />
            <MetricCard label="Status" value={state} />
          </div>
          <div className={styles.panel}>
            <div className={styles.panelHead}><h2 className={styles.sectionTitle}>Project fields</h2><Badge tone="brand">Feeds the rep and the page</Badge></div>
            <div className={styles.fields}>
              <Input label="Project name" defaultValue={p.name} />
              <Select label="Type" defaultValue={p.type} options={["New-build apartments", "Boutique low-rise", "Investment apartments"].map((v) => ({ value: v, label: v }))} />
              <Input label="City" defaultValue={p.city} />
              <Input label="Neighborhood" defaultValue={p.neighborhood} />
              <Input label="Price from (₪)" defaultValue={String(p.priceFrom)} />
              <Input label="Price to (₪)" defaultValue={String(p.priceTo)} />
              <Input label="Delivery" defaultValue={p.delivery} />
              <Input label="Tagline" defaultValue={p.tagline} />
              <div className={styles.fieldFull}><Textarea label="Description" defaultValue={p.descr} /></div>
              <div className={styles.fieldFull}><Input label="Highlights (comma separated)" defaultValue={p.highlights.join(", ")} /></div>
              <div className={styles.fieldFull}><Input label="Amenities" defaultValue={p.amenities.join(", ")} /></div>
              <div className={styles.fieldFull}><Input label="Payment terms" defaultValue={p.paymentTerms} /></div>
            </div>
          </div>
          <div className={styles.panel}>
            <div className={styles.panelHead}><h2 className={styles.sectionTitle}>Layouts</h2><span className={styles.panelHint}>{p.units.length} types</span></div>
            <table className={styles.table}>
              <thead><tr><th>Layout</th><th>Rooms</th><th>Size</th><th>Floors</th><th>From</th></tr></thead>
              <tbody>{p.units.map((u) => (<tr key={u.id}><td>{u.label}</td><td className={styles.muted}>{u.rooms}</td><td className={styles.muted}>{u.sqm} sqm</td><td className={styles.muted}>{u.floor}</td><td className={styles.strong}>{formatPrice(u.priceFrom)}</td></tr>))}</tbody>
            </table>
          </div>
          <div className={styles.panel}>
            <div className={styles.panelHead}><h2 className={styles.sectionTitle}>Media library</h2><span className={styles.panelHint}>The rep sends these in the chat</span></div>
            <div className={styles.mediaGrid}>
              {p.images ? (
                <>
                  <div className={styles.thumb}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={p.images.hero} alt="" className={styles.thumbImg} /><span className={styles.thumbTag}>Exterior</span></div>
                  <div className={styles.thumb}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={p.images.gallery[0]} alt="" className={styles.thumbImg} /><span className={styles.thumbTag}>Interior</span></div>
                </>
              ) : (
                <p className={styles.hint}>No media yet. Add renderings and photos in the wizard.</p>
              )}
              <label className={styles.drop} style={{ aspectRatio: "4/3", padding: 8 }}><strong>+ Add</strong><span>Image or video</span><input type="file" accept="image/*,video/*" multiple hidden /></label>
            </div>
          </div>
        </>
      )}

      {tab === "Rep" && (
        <div className={styles.twoCol}>
          <div className={styles.stack}>
            <div className={styles.panel}>
              <div className={styles.panelHead}><h2 className={styles.sectionTitle}>Persona</h2><span className={styles.panelHint}>Who the rep is, how she speaks</span></div>
              <Input label="Rep name" defaultValue={REP.name} />
              <div><p className={styles.hint}>Tone</p><SegmentedControl options={["Warm", "Professional", "Direct", "Luxury"]} value={tone} onChange={setTone} /></div>
              <div><p className={styles.hint}>Language</p><SegmentedControl options={["Hebrew", "English", "Auto-detect"]} value={lang} onChange={setLang} /></div>
              <div><p className={styles.hint}>Response length</p><SegmentedControl options={["Short", "Medium", "Detailed"]} value={length} onChange={setLength} /></div>
              <Textarea label="Extra instructions (optional)" placeholder="Anything specific about this project, e.g. never mention the neighboring construction site." />
            </div>
            <div className={styles.panel}>
              <div className={styles.panelHead}><h2 className={styles.sectionTitle}>Rendered prompt</h2><Badge tone="neutral">Read-only · generated</Badge></div>
              <p className={styles.hint}>Built automatically from the base prompt and this project&apos;s fields. Nobody writes a prompt per project. <Link href="/real-estate/base-prompt" style={{ color: "var(--link)" }}>Edit the base prompt</Link></p>
              <div className={styles.promptBox} style={{ maxHeight: 420, overflowY: "auto" }}>
                {renderPrompt(DEFAULT_BASE_PROMPT, p, { ...REP, tone: tone.toLowerCase() }, viewings).map((s, i) => (s.v ? <span key={i} className={styles.var}>{s.text}</span> : <span key={i}>{s.text}</span>))}
              </div>
            </div>
            <div className={styles.panel}>
              <div className={styles.panelHead}><h2 className={styles.sectionTitle}>Test console</h2><Button variant="ghost" onClick={() => setChat([{ me: false, t: `Ask me anything about ${p.name}.` }])}>Reset</Button></div>
              <div className={styles.chat}>{chat.map((m, i) => (<div key={i} className={m.me ? styles.chatM : styles.chatB}>{m.t}</div>))}</div>
              <div className={styles.inline}>
                <div style={{ flex: 1 }}><Input placeholder="Try it as a buyer…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} /></div>
                <Button variant="primary" onClick={ask}>Send</Button>
              </div>
            </div>
          </div>
          <div className={styles.panel}>
            <div className={styles.panelHead}><h2 className={styles.sectionTitle}>Live preview</h2><Badge tone="brand">Live</Badge></div>
            <ProjectPreview p={p} />
            <p className={styles.hint} style={{ textAlign: "center" }}>This is exactly what the buyer sees, from any channel.</p>
          </div>
        </div>
      )}

      {tab === "Calendar" && (
        <div className={styles.panel}>
          <div className={styles.panelHead}><h2 className={styles.sectionTitle}>Viewing slots</h2><Badge tone="success">Calendar connected</Badge></div>
          <div className={styles.fields}>
            <Select label="Viewing length" defaultValue="45" options={[{ value: "30", label: "30 min" }, { value: "45", label: "45 min" }, { value: "60", label: "60 min" }]} />
            <Select label="Offer slots in the next" defaultValue="7" options={[{ value: "3", label: "3 days" }, { value: "7", label: "7 days" }, { value: "14", label: "14 days" }]} />
            <Input label="Meeting place" defaultValue={`${p.name} sales office, ${p.neighborhood}`} />
            <Select label="Sales rep who attends" defaultValue="Dana R." options={[{ value: "Dana R.", label: "Dana R." }, { value: "Amit S.", label: "Amit S." }]} />
          </div>
          <h3 className={styles.sectionTitle}>Next available</h3>
          {VIEWING_SLOTS.map((s) => (<div key={s.iso} className={styles.row}><div className={styles.rowText}><span className={styles.rowTitle}>{s.label}</span><span className={styles.rowSub}>Free in the sales team calendar</span></div><Badge tone="success">Open</Badge></div>))}
        </div>
      )}

      {(tab === "Leads" || tab === "Viewings") && (
        <div className={styles.panel}>
          <div className={styles.panelHead}><h2 className={styles.sectionTitle}>{tab}</h2><span className={styles.panelHint}>{tab === "Leads" ? "Everyone who asked about this project" : "Booked viewings"}</span></div>
          <div className={styles.scroll}>
            <table className={styles.table}>
              <thead><tr><th>Lead</th><th>Source</th><th>Looking for</th><th>Budget</th><th>Mortgage</th><th>Rating</th><th>Status</th><th>Viewing</th></tr></thead>
              <tbody>
                {(tab === "Leads" ? leads : leads.filter((l) => l.viewing)).map((l) => (
                  <tr key={l.id}>
                    <td><div className={styles.person}><span className={styles.personName}>{l.name}</span><span className={styles.personSub}>{l.phone}</span></div></td>
                    <td className={styles.muted}>{l.source}</td><td className={styles.muted}>{l.purpose}</td><td>{l.budget}</td><td className={styles.muted}>{l.mortgage}</td>
                    <td className={styles.stars}>{stars(l.rating)}</td><td><Badge tone={STATUS_TONE[l.status]}>{l.status}</Badge></td><td className={styles.muted}>{l.viewing ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "Analytics" && (
        <>
          <div className={styles.kpis}>
            <MetricCard label="Entered" value={String(funnel.entered)} />
            <MetricCard label="Qualified" value={String(funnel.qualified)} footnote={`${Math.round((funnel.qualified / funnel.entered) * 100)}% of entered`} />
            <MetricCard label="Booked" value={String(funnel.booked)} footnote={`${Math.round((funnel.booked / funnel.qualified) * 100)}% of qualified`} />
            <MetricCard label="Time to viewing" value={funnel.timeToViewing.replace("d", "")} unit="days" highlight />
          </div>
          <div className={styles.panel}>
            <h2 className={styles.sectionTitle}>Funnel</h2>
            <div className={styles.bars}>
              {[["Entered", funnel.entered], ["Qualified", funnel.qualified], ["Booked", funnel.booked]].map(([k, v]) => (
                <div key={k as string} className={styles.bar}><span>{k}</span><div className={styles.barTrack}><div className={styles.barFill} style={{ width: `${((v as number) / funnel.entered) * 100}%` }} /></div><span className={styles.barNum}>{v}</span></div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === "Channels" && (
        <div className={styles.stack}>
          <div className={styles.panel}>
            <h2 className={styles.sectionTitle}>Project page</h2>
            <p className={styles.hint}>The shareable link exists the moment the project is published. Add a source to every link so each lead keeps where it came from.</p>
            <div className={styles.linkBox}><span style={{ flex: 1 }}>{link}?src=meta</span><Button variant="secondary" onClick={() => navigator.clipboard?.writeText(`${link}?src=meta`)}>Copy</Button></div>
            <div className={styles.fields}>
              <Select label="Source" defaultValue="meta" options={[{ value: "meta", label: "Meta ads" }, { value: "google", label: "Google ads" }, { value: "website", label: "Website" }, { value: "instagram", label: "Instagram bio" }, { value: "qr", label: "QR on site hoarding" }]} />
              <Input label="Campaign tag (optional)" placeholder="summer-launch" />
            </div>
            <div className={styles.qr} aria-label="QR code" />
          </div>
          <div className={styles.panel}>
            <h2 className={styles.sectionTitle}>Lead intake</h2>
            {[["Meta / Google lead forms", "Connected via webhook · 412 leads"], ["Website form", "POST to the project webhook · 214 leads"], ["CRM push", "Google Sheet rows become leads · 109 leads"]].map(([t, s]) => (
              <div key={t} className={styles.row}><div className={styles.rowText}><span className={styles.rowTitle}>{t}</span><span className={styles.rowSub}>{s}</span></div><Badge tone="success">Live</Badge></div>
            ))}
          </div>
        </div>
      )}

      {tab === "Settings" && (
        <div className={styles.stack}>
          <div className={styles.panel}><h2 className={styles.sectionTitle}>Project status</h2><SegmentedControl options={["Active", "Paused", "Draft"]} value={state} onChange={setState} /></div>
          <div className={styles.panel}>
            <div className={styles.panelHead}><h2 className={styles.sectionTitle}>Lead flow</h2><span className={styles.panelHint}>How this project talks to leads</span></div>
            <div><p className={styles.hint}>Channel</p><SegmentedControl options={["WhatsApp", "Web link"]} value={channel} onChange={setChannel} /></div>
            <p className={styles.hint}>{channel === "WhatsApp" ? "The whole conversation happens in the WhatsApp thread." : "The lead opens the project page, phone pre-filled."}</p>
            <Select label="Opening template (sent to new leads)" defaultValue="lead_welcome" options={[{ value: "lead_welcome", label: "lead_welcome" }, { value: "lead_reengage", label: "lead_reengage" }]} />
            <Toggle label="Offer a viewing at the end of the conversation" checked={viewings} onChange={(e) => setViewings(e.target.checked)} />
            <Toggle label="Offer other projects when this one isn't a fit" checked={others} onChange={(e) => setOthers(e.target.checked)} />
          </div>
          <div className={styles.sheet} style={{ borderColor: "var(--danger)" }}>
            <div className={styles.sheetText}><strong>Archive this project</strong><span className={styles.sheetSub}>Leads in progress will be notified. This can&apos;t be undone.</span></div>
            <Button variant="secondary">Archive project</Button>
          </div>
        </div>
      )}
    </Shell>
  );
}
