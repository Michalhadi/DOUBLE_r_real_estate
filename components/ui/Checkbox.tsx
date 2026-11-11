import { InputHTMLAttributes, useId } from "react";
import styles from "./Checkbox.module.css";
import { CheckIcon } from "../icons";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Checkbox({ label, id, className, ...rest }: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  return (
    <label className={[styles.wrapper, className].filter(Boolean).join(" ")} htmlFor={checkboxId}>
      <span className={styles.box}>
        <input type="checkbox" id={checkboxId} className={styles.input} {...rest} />
        <CheckIcon size={12} className={styles.check} />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
