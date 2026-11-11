import { TextareaHTMLAttributes, useId } from "react";
import styles from "./Textarea.module.css";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
}

export function Textarea({ label, helperText, id, className, rows = 3, ...rest }: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      {label && (
        <label className={styles.label} htmlFor={textareaId}>
          {label}
        </label>
      )}
      <textarea id={textareaId} className={styles.textarea} rows={rows} {...rest} />
      {helperText && <span className={styles.helperText}>{helperText}</span>}
    </div>
  );
}
