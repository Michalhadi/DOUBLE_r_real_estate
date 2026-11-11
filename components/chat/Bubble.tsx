import styles from "./Bubble.module.css";

interface BubbleProps {
  from: "bot" | "candidate";
  children: string;
}

export function Bubble({ from, children }: BubbleProps) {
  return (
    <div className={[styles.row, from === "candidate" && styles.rowCandidate].filter(Boolean).join(" ")}>
      <div className={[styles.bubble, styles[from]].join(" ")}>{children}</div>
    </div>
  );
}
