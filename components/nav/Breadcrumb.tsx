import Link from "next/link";
import styles from "./Breadcrumb.module.css";
import { ChevronRightIcon } from "../icons";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className={styles.segment}>
            {!isLast && item.href ? (
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? styles.current : styles.link}>{item.label}</span>
            )}
            {!isLast && <ChevronRightIcon size={14} className={styles.separator} />}
          </span>
        );
      })}
    </nav>
  );
}
