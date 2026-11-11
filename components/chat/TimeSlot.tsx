import styles from "./TimeSlot.module.css";
import { ClockIcon } from "../icons";

interface TimeSlotProps {
  time: string;
  state?: "default" | "selected" | "disabled";
  onClick?: () => void;
}

export function TimeSlot({ time, state = "default", onClick }: TimeSlotProps) {
  return (
    <button
      type="button"
      className={[styles.slot, styles[state]].join(" ")}
      disabled={state === "disabled"}
      onClick={onClick}
    >
      <ClockIcon size={14} />
      {time}
    </button>
  );
}
