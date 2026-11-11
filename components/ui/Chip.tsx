import styles from "./Chip.module.css";
import { XIcon } from "../icons";

interface ChipProps {
  children: string;
  active?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
}

export function Chip({ children, active = false, onRemove, onClick }: ChipProps) {
  const className = [styles.chip, active && styles.active, onClick && styles.clickable]
    .filter(Boolean)
    .join(" ");

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <span className={className}>
      {children}
      {onRemove && (
        <button type="button" className={styles.remove} aria-label={`Remove ${children}`} onClick={onRemove}>
          <XIcon size={12} />
        </button>
      )}
    </span>
  );
}
