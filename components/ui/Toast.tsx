import styles from "./Toast.module.css";
import { CheckIcon, AlertIcon, XIcon } from "../icons";

export type ToastTone = "neutral" | "success" | "warning" | "danger";

interface ToastProps {
  tone?: ToastTone;
  message: string;
  onDismiss?: () => void;
}

const toneIcon: Record<ToastTone, typeof CheckIcon> = {
  neutral: AlertIcon,
  success: CheckIcon,
  warning: AlertIcon,
  danger: AlertIcon,
};

export function Toast({ tone = "neutral", message, onDismiss }: ToastProps) {
  const Icon = toneIcon[tone];
  return (
    <div className={[styles.toast, styles[tone]].join(" ")} role="status">
      <Icon size={16} className={styles.icon} />
      <span className={styles.message}>{message}</span>
      {onDismiss && (
        <button type="button" className={styles.dismiss} aria-label="Dismiss" onClick={onDismiss}>
          <XIcon size={14} />
        </button>
      )}
    </div>
  );
}
