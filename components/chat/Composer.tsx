"use client";

import { useState } from "react";
import styles from "./Composer.module.css";
import { MicIcon, SendIcon } from "../icons";

interface ComposerProps {
  placeholder: string;
  defaultValue?: string;
  onSend: (value: string) => void;
}

export function Composer({ placeholder, defaultValue = "", onSend }: ComposerProps) {
  const [value, setValue] = useState(defaultValue);

  function send() {
    if (!value.trim()) return;
    onSend(value.trim());
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.hint}>
        <MicIcon size={14} /> You can type your answer, or tap the mic to speak — I’ll transcribe it
        automatically.
      </p>
      <div className={styles.row}>
        <button type="button" className={styles.mic} aria-label="Answer by voice">
          <MicIcon size={18} />
        </button>
        <input
          className={styles.input}
          value={value}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && send()}
        />
        <button type="button" className={styles.send} aria-label="Send" onClick={send}>
          <SendIcon size={16} />
        </button>
      </div>
    </div>
  );
}
