import Link from "next/link";
import styles from "./SetupChecklist.module.css";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { SparkleIcon, CheckIcon } from "../icons";

export interface ChecklistStep {
  label: string;
  description: string;
  done: boolean;
  href?: string;
}

export function SetupChecklist({ steps }: { steps: ChecklistStep[] }) {
  const doneCount = steps.filter((step) => step.done).length;
  if (doneCount === steps.length) return null;

  const percent = Math.round((doneCount / steps.length) * 100);

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <div className={styles.headText}>
          <span className={styles.icon}>
            <SparkleIcon size={16} />
          </span>
          <div>
            <span className={styles.title}>Finish setting up your workspace</span>
            <p className={styles.hint}>
              {doneCount} of {steps.length} complete — this checklist hides itself once everything&apos;s
              connected, and returns if a step regresses.
            </p>
          </div>
        </div>
        <span className={styles.percent}>{percent}%</span>
      </div>

      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${percent}%` }} />
      </div>

      <div className={styles.steps}>
        {steps.map((step, index) => (
          <div key={step.label} className={styles.step}>
            <span className={[styles.stepIcon, step.done && styles.stepIconDone].filter(Boolean).join(" ")}>
              {step.done ? <CheckIcon size={14} /> : index + 1}
            </span>
            <div className={styles.stepBody}>
              <div className={styles.stepTitleRow}>
                <span className={styles.stepTitle}>{step.label}</span>
                {step.done && <Badge tone="success">Done</Badge>}
              </div>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
            {!step.done && step.href && (
              <Link href={step.href}>
                <Button variant="secondary">Start →</Button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
