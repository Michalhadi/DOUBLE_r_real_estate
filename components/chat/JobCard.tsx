import styles from "./JobCard.module.css";
import { Badge } from "../ui/Badge";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  type: string;
}

export function JobCard({ title, company, location, type }: JobCardProps) {
  return (
    <div className={styles.card}>
      <Badge tone="brand">{type}</Badge>
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.meta}>
        {company} · {location}
      </p>
    </div>
  );
}
