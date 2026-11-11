import styles from "./ScheduleConfirmation.module.css";
import { CheckIcon, ClockIcon, ExternalLinkIcon } from "../icons";
import { Button } from "../ui/Button";

interface ScheduleConfirmationProps {
  dateTime: string;
  startIso: string;
  durationMinutes?: number;
  format: string;
  videoLink: string;
  address: string;
  interviewer: string;
  onReschedule?: () => void;
  onCancel?: () => void;
}

function toIcsDate(iso: string) {
  return iso.replace(/[-:]/g, "").split(".")[0];
}

function addMinutes(iso: string, minutes: number) {
  const date = new Date(iso);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString().slice(0, 19);
}

function downloadIcs({
  dateTime,
  startIso,
  durationMinutes,
  format,
  videoLink,
  address,
  interviewer,
}: ScheduleConfirmationProps) {
  const endIso = addMinutes(startIso, durationMinutes ?? 30);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Double R//Interview//EN",
    "BEGIN:VEVENT",
    `DTSTART:${toIcsDate(startIso)}`,
    `DTEND:${toIcsDate(endIso)}`,
    `SUMMARY:Double R interview — ${dateTime}`,
    `DESCRIPTION:Format: ${format}\\nVideo link: ${videoLink}\\nWith: ${interviewer}`,
    `LOCATION:${address}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "double-r-interview.ics";
  link.click();
  URL.revokeObjectURL(url);
}

export function ScheduleConfirmation(props: ScheduleConfirmationProps) {
  const { dateTime, format, videoLink, address, interviewer, onReschedule, onCancel } = props;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.check}>
          <CheckIcon size={18} />
        </span>
        <div>
          <h4 className={styles.title}>Interview scheduled</h4>
          <p className={styles.subtitle}>Add it to your calendar so you don’t miss it.</p>
        </div>
      </div>

      <dl className={styles.details}>
        <div className={styles.row}>
          <dt className={styles.label}>
            <ClockIcon size={14} /> When
          </dt>
          <dd className={styles.value}>{dateTime}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.label}>Format</dt>
          <dd className={styles.value}>{format}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.label}>
            <ExternalLinkIcon size={14} /> Video link
          </dt>
          <dd className={styles.value}>
            <a href={videoLink} className={styles.link}>
              {videoLink}
            </a>
          </dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.label}>Office address</dt>
          <dd className={styles.value}>{address}</dd>
        </div>
        <div className={styles.row}>
          <dt className={styles.label}>With</dt>
          <dd className={styles.value}>{interviewer}</dd>
        </div>
      </dl>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => downloadIcs(props)}>
          Add to calendar
        </Button>
        {onReschedule && (
          <Button variant="ghost" onClick={onReschedule}>
            Reschedule
          </Button>
        )}
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
