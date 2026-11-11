import styles from "./Avatar.module.css";
import { UserIcon } from "../icons";

interface AvatarProps {
  name?: string;
  size?: "sm" | "md" | "lg";
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Avatar({ name, size = "md" }: AvatarProps) {
  return (
    <span className={[styles.avatar, styles[size]].join(" ")}>
      {name ? initials(name) : <UserIcon size={size === "sm" ? 14 : 18} />}
    </span>
  );
}
