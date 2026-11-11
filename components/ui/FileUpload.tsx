"use client";

import { useRef, useState } from "react";
import styles from "./FileUpload.module.css";
import { PaperclipIcon, CheckIcon } from "../icons";

interface FileUploadProps {
  label?: string;
  initialFileName?: string;
  onUpload?: (fileName: string) => void;
}

export function FileUpload({
  label = "Attach your resume",
  initialFileName,
  onUpload,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(initialFileName ?? null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    onUpload?.(file.name);
  }

  if (fileName) {
    return (
      <div className={styles.uploaded}>
        <span className={styles.check}>
          <CheckIcon size={14} />
        </span>
        <span className={styles.fileName}>{fileName}</span>
      </div>
    );
  }

  return (
    <>
      <button type="button" className={styles.dropzone} onClick={() => inputRef.current?.click()}>
        <PaperclipIcon size={18} />
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className={styles.hiddenInput}
        onChange={handleChange}
      />
    </>
  );
}
