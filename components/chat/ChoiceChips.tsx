"use client";

import { useState } from "react";
import styles from "./ChoiceChips.module.css";

interface ChoiceChipsProps {
  options: string[];
  onSelect?: (option: string) => void;
}

export function ChoiceChips({ options, onSelect }: ChoiceChipsProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className={styles.row}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={[styles.chip, option === selected && styles.selected].filter(Boolean).join(" ")}
          onClick={() => {
            setSelected(option);
            onSelect?.(option);
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
