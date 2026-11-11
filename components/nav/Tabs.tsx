"use client";

import { useState } from "react";
import styles from "./Tabs.module.css";

interface TabsProps {
  tabs: string[];
  value?: string;
  defaultTab?: string;
  onChange?: (tab: string) => void;
}

export function Tabs({ tabs, value, defaultTab, onChange }: TabsProps) {
  const [internal, setInternal] = useState(defaultTab ?? tabs[0]);
  const active = value ?? internal;

  function selectTab(tab: string) {
    if (value === undefined) setInternal(tab);
    onChange?.(tab);
  }

  return (
    <div className={styles.tabs} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={tab === active}
          className={[styles.tab, tab === active && styles.active].filter(Boolean).join(" ")}
          onClick={() => selectTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
