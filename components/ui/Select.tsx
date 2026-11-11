import { SelectHTMLAttributes, useId } from "react";
import styles from "./Select.module.css";
import { ChevronDownIcon } from "../icons";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, id, className, ...rest }: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      {label && (
        <label className={styles.label} htmlFor={selectId}>
          {label}
        </label>
      )}
      <div className={styles.wrapper}>
        <select id={selectId} className={styles.select} {...rest}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon size={16} className={styles.chevron} />
      </div>
    </div>
  );
}
