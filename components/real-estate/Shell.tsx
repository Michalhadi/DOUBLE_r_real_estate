import type { ReactNode } from "react";
import styles from "@/app/real-estate/_css/admin.module.css";
import { Sidebar } from "@/components/nav/Sidebar";
import { Topbar } from "@/components/nav/Topbar";
import { RE_NAV } from "@/lib/real-estate/nav";

export function Shell({ activeId, children }: { activeId: string; children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <Sidebar items={RE_NAV} activeId={activeId} brand="Double R Estate" />
      <div className={styles.main}>
        <Topbar userName="Michal Regev" />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
