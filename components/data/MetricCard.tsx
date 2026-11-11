import { ReactNode } from "react";
import styles from "./MetricCard.module.css";
import { Button } from "../ui/Button";

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  change?: { direction: "up" | "down"; value: string };
  footnote?: ReactNode;
  icon?: ReactNode;
  actionLabel?: string;
  highlight?: boolean;
}

export function MetricCard({
  label,
  value,
  unit,
  change,
  footnote,
  icon,
  actionLabel,
  highlight = false,
}: MetricCardProps) {
  return (
    <div className={[styles.card, highlight && styles.highlight].filter(Boolean).join(" ")}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <div className={styles.value}>
        {value}
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
      <div className={styles.footer}>
        {change && (
          <span className={change.direction === "up" ? styles.up : styles.down}>
            {change.direction === "up" ? "↑" : "↓"} {change.value}
          </span>
        )}
        {footnote && <span className={styles.footnote}>{footnote}</span>}
        {actionLabel && (
          <Button variant="secondary" className={styles.action}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
