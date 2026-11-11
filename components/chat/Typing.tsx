import styles from "./Typing.module.css";

export function Typing() {
  return (
    <div className={styles.row}>
      <div className={styles.bubble}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    </div>
  );
}
