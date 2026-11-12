"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "../_css/admin.module.css";
import studio from "./studio.module.css";
import { Shell } from "@/components/real-estate/Shell";
import { Tabs } from "@/components/nav/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { REP } from "@/lib/real-estate/data";
import { DEFAULT_THEME, downscale, resetTheme, saveTheme, useTheme, type Layout, type Theme } from "@/lib/real-estate/theme";

const TABS = ["Rep", "Project page", "Properties page"];
const SWATCHES = ["#1f6f8b", "#6a3fb0", "#5f7f3b", "#b4532a", "#9c2f4f", "#1d4ed8", "#0f766e", "#101828"];
const LAYOUTS: { id: Layout; name: string; hint: string }[] = [
  { id: "cinematic", name: "Cinematic", hint: "Full-bleed image, text over it" },
  { id: "split", name: "Split", hint: "Copy left, image right" },
  { id: "editorial", name: "Editorial", hint: "Big headline, wide image below" },
];

export default function RepStudio() {
  return (<Suspense><Studio /></Suspense>);
}

function Studio() {
  const qs = useSearchParams();
  const initial = qs.get("tab") === "properties" ? "Properties page" : qs.get("tab") === "page" ? "Project page" : "Rep";
  const [tab, setTab] = useState(initial);
  const [device, setDevice] = useState("Mobile");
  const theme = useTheme();
  const [tone, setTone] = useState("Warm");
  const [lang, setLang] = useState("Auto-detect");

  const update = (fn: (t: Theme) => Theme) => saveTheme(fn(theme));
  const page = (patch: Partial<Theme["page"]>) => update((t) => ({ ...t, page: { ...t.page, ...patch } }));
  const list = (patch: Partial<Theme["list"]>) => update((t) => ({ ...t, list: { ...t.list, ...patch } }));

  async function onPhoto(f: File | undefined) {
    if (!f) return;
    const data = await downscale(f);
    update((t) => ({ ...t, repPhoto: data }));
  }

  const src = tab === "Properties page" ? "/real-estate/properties" : "/real-estate/project/marina-towers";
  const photo = theme.repPhoto ?? REP.photo;

  return (
    <Shell activeId={tab === "Properties page" ? "listpage" : "rep"}>
      <div className={styles.head}>
        <div>
          <h1 className={styles.pageTitle}>Rep &amp; page design</h1>
          <p className={styles.pageSubtitle}>Every company looks different. Set the rep, the brand and the layout once; every project page and the all-properties page follow.</p>
        </div>
        <div className={styles.inline}>
          <Badge tone="success">Saved automatically</Badge>
          <Button variant="ghost" onClick={() => resetTheme()}>Reset to default</Button>
        </div>
      </div>
      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      <div className={styles.twoCol}>
        <div className={styles.stack}>
          {tab === "Rep" && (
            <>
              <div className={styles.panel}>
                <h2 className={styles.sectionTitle}>Photo</h2>
                <p className={styles.hint}>Shown round on the project page, the properties page and in WhatsApp. Use a photo you have the rights to.</p>
                <div className={styles.repRow}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {photo ? <img src={photo} alt="" className={studio.avatar} /> : <span className={studio.avatar} />}
                  <label className={studio.upload}>Upload a photo<input type="file" accept="image/*" hidden onChange={(e) => onPhoto(e.target.files?.[0])} /></label>
                  {theme.repPhoto && <Button variant="ghost" onClick={() => update((t) => ({ ...t, repPhoto: undefined }))}>Remove</Button>}
                </div>
              </div>
              <div className={styles.panel}>
                <h2 className={styles.sectionTitle}>Persona</h2>
                <Input label="Rep name" value={theme.repName} onChange={(e) => update((t) => ({ ...t, repName: e.target.value }))} />
                <div><p className={styles.hint}>Tone</p><SegmentedControl options={["Warm", "Professional", "Direct", "Luxury"]} value={tone} onChange={setTone} /></div>
                <div><p className={styles.hint}>Language</p><SegmentedControl options={["Hebrew", "English", "Auto-detect"]} value={lang} onChange={setLang} /></div>
                <p className={styles.hint}>The persona fills the base prompt: <a href="/real-estate/base-prompt" style={{ color: "var(--link)" }}>review it</a>.</p>
              </div>
            </>
          )}

          {tab === "Project page" && (
            <>
              <div className={styles.panel}>
                <h2 className={styles.sectionTitle}>Page structure</h2>
                <div className={studio.layouts}>
                  {LAYOUTS.map((l) => (
                    <button key={l.id} type="button" className={[studio.layout, theme.page.layout === l.id && studio.layoutOn].filter(Boolean).join(" ")} onClick={() => page({ layout: l.id })}>
                      <span className={[studio.wire, studio[`wire_${l.id}`]].join(" ")}><i /><i /><i /></span>
                      <strong>{l.name}</strong><small>{l.hint}</small>
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.panel}>
                <h2 className={styles.sectionTitle}>Brand</h2>
                <Input label="Company name (top of the page)" value={theme.page.company} onChange={(e) => page({ company: e.target.value })} />
                <div>
                  <p className={styles.hint}>Brand color</p>
                  <div className={studio.swatches}>
                    {SWATCHES.map((c) => (<button key={c} type="button" aria-label={c} className={[studio.swatch, theme.page.accent === c && studio.swatchOn].filter(Boolean).join(" ")} style={{ background: c }} onClick={() => page({ accent: c })} />))}
                    <label className={studio.custom}>Custom<input type="color" value={theme.page.accent} onChange={(e) => page({ accent: e.target.value })} /></label>
                  </div>
                </div>
                <div><p className={styles.hint}>Top of the page</p><SegmentedControl options={["Dark", "Light"]} value={theme.page.tone === "dark" ? "Dark" : "Light"} onChange={(v) => page({ tone: v === "Dark" ? "dark" : "light" })} /></div>
                <div><p className={styles.hint}>Headline font</p><SegmentedControl options={["Sans", "Serif"]} value={theme.page.font === "sans" ? "Sans" : "Serif"} onChange={(v) => page({ font: v === "Sans" ? "sans" : "serif" })} /></div>
                <Input label="Main button text" value={theme.page.cta} onChange={(e) => page({ cta: e.target.value })} helperText="Use {rep} for the rep's name" />
              </div>
              <p className={styles.hint}>Applies to every project page. Individual projects can override it in their own settings.</p>
            </>
          )}

          {tab === "Properties page" && (
            <>
              <div className={styles.panel}>
                <h2 className={styles.sectionTitle}>Page copy</h2>
                <Input label="Headline" value={theme.list.headline} onChange={(e) => list({ headline: e.target.value })} />
                <Input label="Sub-headline" value={theme.list.sub} onChange={(e) => list({ sub: e.target.value })} helperText="Use {rep} for the rep's name" />
              </div>
              <div className={styles.panel}>
                <h2 className={styles.sectionTitle}>Layout</h2>
                <div><p className={styles.hint}>Project cards</p><SegmentedControl options={["Grid", "List"]} value={theme.list.layout === "grid" ? "Grid" : "List"} onChange={(v) => list({ layout: v === "Grid" ? "grid" : "list" })} /></div>
                <div><p className={styles.hint}>Card style</p><SegmentedControl options={["Photo first", "Compact"]} value={theme.list.cardStyle === "photo" ? "Photo first" : "Compact"} onChange={(v) => list({ cardStyle: v === "Photo first" ? "photo" : "compact" })} /></div>
                <Toggle label="Show the city filter" checked={theme.list.filterCity} onChange={(e) => list({ filterCity: e.target.checked })} />
                <Toggle label="Show the type filter" checked={theme.list.filterType} onChange={(e) => list({ filterType: e.target.checked })} />
                <Toggle label="Show the rep strip (&quot;Ask Dana&quot;)" checked={theme.list.showRep} onChange={(e) => list({ showRep: e.target.checked })} />
                <p className={styles.hint}>Brand color, top-of-page tone and font follow the Project page settings.</p>
              </div>
              <div className={styles.panel}>
                <h2 className={styles.sectionTitle}>Publish and embed</h2>
                <div className={styles.linkBox}>https://double-r-real-estate.vercel.app/real-estate/properties</div>
                <div className={styles.linkBox}>{`<iframe src="https://double-r-real-estate.vercel.app/real-estate/properties" style="width:100%;height:900px;border:0"></iframe>`}</div>
                <p className={styles.hint}>Link it from your website, or paste the embed code into any page.</p>
              </div>
            </>
          )}
        </div>

        <div className={styles.panel} style={{ position: "sticky", top: 16 }}>
          <div className={styles.panelHead}>
            <h2 className={styles.sectionTitle}>Live preview</h2>
            <SegmentedControl options={["Mobile", "Desktop"]} value={device} onChange={setDevice} />
          </div>
          <div className={studio.frameWrap}>
            <iframe key={src} src={src} title="Preview" className={device === "Mobile" ? studio.frameMobile : studio.frameDesktop} />
          </div>
          <p className={styles.hint} style={{ textAlign: "center" }}>The real page, updated as you change things.</p>
        </div>
      </div>
    </Shell>
  );
}

export { DEFAULT_THEME };
