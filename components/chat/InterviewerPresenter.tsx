import Image from "next/image";
import styles from "./InterviewerPresenter.module.css";

interface InterviewerPresenterProps {
  name: string;
  photo: string;
}

export function InterviewerPresenter({ name, photo }: InterviewerPresenterProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.avatar}>
        <Image src={photo} alt={name} fill sizes="140px" className={styles.photo} priority />
      </div>
      <div className={styles.text}>
        <span className={styles.eyebrow}>Your AI interviewer</span>
        <span className={styles.name}>{name}</span>
      </div>
    </div>
  );
}
