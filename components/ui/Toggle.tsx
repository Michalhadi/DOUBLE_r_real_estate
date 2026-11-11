import { InputHTMLAttributes, useId } from "react";
import styles from "./Toggle.module.css";

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export function Toggle({ label, id, className, ...rest }: ToggleProps) {
  const generatedId = useId();
  const toggleId = id ?? generatedId;
  return (
    <label className={[styles.wrapper, className].filter(Boolean).join(" ")} htmlFor={toggleId}>
      <span className={styles.track}>
        <input type="checkbox" id={toggleId} className={styles.input} {...rest} />
        <span className={styles.thumb} />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
