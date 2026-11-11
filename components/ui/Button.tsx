import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "ghost" | "accent";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
  iconOnly?: boolean;
}

export function Button({
  variant = "primary",
  icon,
  iconOnly = false,
  children,
  className,
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], iconOnly && styles.iconOnly, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} aria-label={iconOnly ? String(children) : undefined} {...rest}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {!iconOnly && children}
    </button>
  );
}
