"use client";

import styles from "./Stepper.module.css";
import { CheckIcon } from "../icons";

interface StepperProps {
  steps: string[];
  currentIndex: number;
  furthestIndex: number;
  onStepClick: (index: number) => void;
}

export function Stepper({ steps, currentIndex, furthestIndex, onStepClick }: StepperProps) {
  return (
    <ol className={styles.row}>
      {steps.map((step, index) => {
        const isCurrent = index === currentIndex;
        const isDone = index < furthestIndex;
        const isReachable = index <= furthestIndex;
        return (
          <li key={step} className={styles.item}>
            <button
              type="button"
              className={[styles.step, isCurrent && styles.current, isDone && styles.done]
                .filter(Boolean)
                .join(" ")}
              onClick={() => isReachable && onStepClick(index)}
              disabled={!isReachable}
            >
              <span className={styles.circle}>{isDone ? <CheckIcon size={12} /> : index + 1}</span>
              <span className={styles.label}>{step}</span>
            </button>
            {index < steps.length - 1 && <span className={styles.connector} />}
          </li>
        );
      })}
    </ol>
  );
}
