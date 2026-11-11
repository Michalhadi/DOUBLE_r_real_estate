import { ReactNode } from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css";

export interface SidebarItem {
  id: string;
  label: string;
  icon: ReactNode;
  href?: string;
}

export interface SidebarGroup {
  label?: string;
  items: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[] | SidebarGroup[];
  activeId: string;
  brand?: string;
}

function isGrouped(items: SidebarItem[] | SidebarGroup[]): items is SidebarGroup[] {
  return items.length > 0 && "items" in items[0];
}

export function Sidebar({ items, activeId, brand = "Double R" }: SidebarProps) {
  const groups: SidebarGroup[] = isGrouped(items) ? items : [{ items }];

  return (
    <nav className={styles.sidebar} aria-label="Primary">
      <div className={styles.logo}>{brand}</div>
      {groups.map((group, index) => (
        <div className={styles.group} key={group.label ?? index}>
          {group.label && <div className={styles.groupLabel}>{group.label}</div>}
          <ul className={styles.list}>
            {group.items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href ?? "#"}
                  className={[styles.item, item.id === activeId && styles.active]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={item.id === activeId ? "page" : undefined}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
