import styles from "./MatchCard.module.css";

interface MatchCardProps {
  title: string;
  score: number;
}

export function MatchCard({ title, score }: MatchCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.score}>{score}% match</span>
      </div>
      <div className={styles.track}>
        <div className={styles.fill} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
