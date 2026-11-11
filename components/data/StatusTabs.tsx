import styles from "./StatusTabs.module.css";

export interface StatusTab {
  id: string;
  label: string;
  count: number;
}

interface StatusTabsProps {
  tabs: StatusTab[];
  activeId: string;
  onChange: (id: string) => void;
}

export function StatusTabs({ tabs, activeId, onChange }: StatusTabsProps) {
  return (
    <div className={styles.tabs} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === activeId}
          className={[styles.tab, tab.id === activeId && styles.active].filter(Boolean).join(" ")}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          <span className={styles.count}>{tab.count}</span>
        </button>
      ))}
    </div>
  );
}
