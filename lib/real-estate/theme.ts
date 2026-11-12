"use client";

import { useMemo, useSyncExternalStore } from "react";

export type Layout = "cinematic" | "split" | "editorial";

export interface PageTheme {
  layout: Layout;
  accent: string;
  tone: "dark" | "light";
  font: "sans" | "serif";
  cta: string;
  company: string;
}

export interface ListTheme {
  layout: "grid" | "list";
  cardStyle: "photo" | "compact";
  filterCity: boolean;
  filterType: boolean;
  showRep: boolean;
  headline: string;
  sub: string;
}

export interface Theme {
  page: PageTheme;
  list: ListTheme;
  repPhoto?: string;
  repName: string;
}

export const DEFAULT_THEME: Theme = {
  page: { layout: "cinematic", accent: "#1f6f8b", tone: "dark", font: "sans", cta: "Ask {rep} anything", company: "Skyline Developments" },
  list: { layout: "grid", cardStyle: "photo", filterCity: true, filterType: true, showRep: true, headline: "Find your next home.", sub: "New-build projects across Israel. Browse below, or tell {rep} what you need and she'll point you to the right one." },
  repName: "Dana",
};

const KEY = "re-theme-v1";
const EVENT = "re-theme-change";

function read(): string {
  try { return window.localStorage.getItem(KEY) ?? ""; } catch { return ""; }
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => { window.removeEventListener("storage", cb); window.removeEventListener(EVENT, cb); };
}

export function parseTheme(raw: string): Theme {
  if (!raw) return DEFAULT_THEME;
  try {
    const t = JSON.parse(raw) as Partial<Theme>;
    return { ...DEFAULT_THEME, ...t, page: { ...DEFAULT_THEME.page, ...t.page }, list: { ...DEFAULT_THEME.list, ...t.list } };
  } catch { return DEFAULT_THEME; }
}

export function useTheme(): Theme {
  const raw = useSyncExternalStore(subscribe, read, () => "");
  return useMemo(() => parseTheme(raw), [raw]);
}

export function saveTheme(t: Theme) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(t));
    window.dispatchEvent(new Event(EVENT));
  } catch { /* storage full or blocked */ }
}

export function resetTheme() {
  try { window.localStorage.removeItem(KEY); window.dispatchEvent(new Event(EVENT)); } catch { /* ignore */ }
}

export const fill = (s: string, rep: string) => s.replaceAll("{rep}", rep);

/** Downscale an uploaded photo so it fits in localStorage. */
export function downscale(file: File, max = 480): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const r = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = url;
  });
}
