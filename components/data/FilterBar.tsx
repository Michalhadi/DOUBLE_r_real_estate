import { ReactNode } from "react";
import styles from "./FilterBar.module.css";
import { SearchIcon } from "../icons";

interface FilterBarProps {
  children?: ReactNode;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function FilterBar({
  children,
  searchPlaceholder = "Search",
  searchValue,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.search}>
        <SearchIcon size={16} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="search"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
        />
      </div>
      {children && <div className={styles.filters}>{children}</div>}
    </div>
  );
}
