"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Topbar.module.css";
import { HelpIcon, SearchIcon, BellIcon, LogOutIcon, SettingsIcon } from "../icons";
import { Avatar } from "../ui/Avatar";
import { Tooltip } from "../ui/Tooltip";

interface TopbarProps {
  userName: string;
}

interface NotificationItem {
  id: string;
  text: string;
  when: string;
}

const NOTIFICATIONS: NotificationItem[] = [
  { id: "1", text: "Dana Cohen passed screening — Senior Backend Developer", when: "12m ago" },
  { id: "2", text: "Interview scheduled with Yael Ben-David — tomorrow 2:00 PM", when: "1h ago" },
  { id: "3", text: "No-show: interview with Omer Levi — today 10:00 AM", when: "3h ago" },
];

export function Topbar({ userName }: TopbarProps) {
  const [search, setSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className={styles.topbar} ref={rootRef}>
      <div className={styles.search}>
        <SearchIcon size={16} className={styles.searchIcon} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search leads, projects…"
          className={styles.searchInput}
        />
      </div>

      <div className={styles.actions}>
        <Tooltip label="Help & support">
          <button type="button" className={styles.iconButton} aria-label="Help">
            <HelpIcon size={18} />
          </button>
        </Tooltip>

        <div className={styles.dropdownWrap}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Notifications"
            onClick={() => {
              setNotifOpen((open) => !open);
              setProfileOpen(false);
            }}
          >
            <BellIcon size={18} />
            {NOTIFICATIONS.length > 0 && <span className={styles.badge}>{NOTIFICATIONS.length}</span>}
          </button>
          {notifOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHead}>Notifications</div>
              <ul className={styles.notifList}>
                {NOTIFICATIONS.map((item) => (
                  <li key={item.id} className={styles.notifItem}>
                    <span className={styles.notifText}>{item.text}</span>
                    <span className={styles.notifWhen}>{item.when}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={styles.dropdownWrap}>
          <button
            type="button"
            className={styles.profile}
            onClick={() => {
              setProfileOpen((open) => !open);
              setNotifOpen(false);
            }}
          >
            <Avatar name={userName} size="sm" />
            <span className={styles.userName}>{userName}</span>
          </button>
          {profileOpen && (
            <div className={[styles.dropdown, styles.profileDropdown].join(" ")}>
              <Link href="#" className={styles.dropdownLink} onClick={() => setProfileOpen(false)}>
                <SettingsIcon size={16} />
                Settings
              </Link>
              <Link href="/real-estate/prototypes" className={styles.dropdownLink} onClick={() => setProfileOpen(false)}>
                <LogOutIcon size={16} />
                Log out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
