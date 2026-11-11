import styles from "./DoneCard.module.css";
import { CheckIcon } from "../icons";

interface DoneCardProps {
  title: string;
  description: string;
}

export function DoneCard({ title, description }: DoneCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.check}>
        <CheckIcon size={20} />
      </span>
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
