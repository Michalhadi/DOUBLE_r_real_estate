import styles from "./TrendChart.module.css";
import { Badge } from "../ui/Badge";

interface TrendChartProps {
  label: string;
  value: string;
  unit: string;
  changeLabel: string;
  points: number[];
  caption: string;
}

function buildPath(points: number[]) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const stepX = 280 / (points.length - 1);

  return points.map((value, index) => {
    const x = 10 + index * stepX;
    const y = 100 - ((value - min) / range) * 80;
    return { x, y };
  });
}

export function TrendChart({ label, value, unit, changeLabel, points, caption }: TrendChartProps) {
  const coords = buildPath(points);
  const line = coords.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${coords[0].x},120 ${line} ${coords[coords.length - 1].x},120`;
  const last = coords[coords.length - 1];

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div>
          <div className={styles.label}>{label}</div>
          <div className={styles.value}>
            {value}
            <span className={styles.unit}>{unit}</span>
          </div>
        </div>
        <Badge tone="success">↓ {changeLabel}</Badge>
      </div>

      <svg viewBox="0 0 300 120" className={styles.svg}>
        <polygon points={area} className={styles.area} />
        <polyline points={line} className={styles.line} fill="none" />
        <circle cx={last.x} cy={last.y} r="4.5" className={styles.dot} />
      </svg>

      <p className={styles.caption}>{caption}</p>
    </div>
  );
}
