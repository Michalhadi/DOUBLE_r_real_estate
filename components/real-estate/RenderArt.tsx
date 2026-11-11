import type { Palette } from "@/lib/real-estate/data";

/**
 * Stand-in for a developer's architectural rendering.
 * In production this is replaced by an image or video from the Media library.
 */
export function RenderArt({
  palette,
  variant = "tower",
  className,
}: {
  palette: Palette;
  variant?: "tower" | "lowrise" | "loft" | "plan" | "night";
  className?: string;
}) {
  const { sky, wall, accent, glass } = palette;
  const windows = (x: number, y: number, cols: number, rows: number, w: number, h: number, gx: number, gy: number) =>
    Array.from({ length: rows }).flatMap((_, r) =>
      Array.from({ length: cols }).map((__, c) => (
        <rect key={`${x}-${y}-${r}-${c}`} x={x + c * (w + gx)} y={y + r * (h + gy)} width={w} height={h} rx={1.5} fill={glass} opacity={0.85} />
      )),
    );

  return (
    <svg viewBox="0 0 400 260" className={className} role="img" aria-label="Rendering" preserveAspectRatio={variant === "plan" ? "xMidYMid meet" : "xMidYMid slice"}>
      <defs>
        <linearGradient id={`sky-${sky}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky} />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill={variant === "plan" ? "#f6f8fa" : variant === "night" ? "#0b1220" : `url(#sky-${sky})`} />
      <circle cx="330" cy="50" r="22" fill="#fff" opacity="0.7" />

      {variant === "night" && (
        <>
          <defs>
            <linearGradient id="nightsky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0b1220" />
              <stop offset="0.7" stopColor="#1b2b45" />
              <stop offset="1" stopColor="#2a3d5c" />
            </linearGradient>
          </defs>
          <rect width="400" height="260" fill="url(#nightsky)" />
          {[...Array(40)].map((_, i) => (
            <circle key={i} cx={(i * 97) % 400} cy={(i * 53) % 120} r={0.8} fill="#fff" opacity={0.5} />
          ))}
          <rect x="20" y="170" width="60" height="90" fill="#101a2c" />
          <rect x="320" y="150" width="70" height="110" fill="#101a2c" />
          <rect x="150" y="30" width="70" height="230" fill="#16233a" />
          <rect x="150" y="30" width="70" height="6" fill={accent} />
          {Array.from({ length: 16 }).flatMap((_, r) =>
            Array.from({ length: 4 }).map((__, c) => (
              <rect key={`${r}-${c}`} x={157 + c * 15} y={44 + r * 13} width={9} height={7} rx={1}
                fill={(r * 7 + c * 3) % 5 === 0 ? "#2a3d5c" : "#ffd98a"} opacity={(r * 7 + c * 3) % 5 === 0 ? 1 : 0.75} />
            )),
          )}
          <rect x="226" y="95" width="48" height="165" fill="#121d31" />
          {Array.from({ length: 11 }).flatMap((_, r) =>
            Array.from({ length: 3 }).map((__, c) => (
              <rect key={`b${r}-${c}`} x={232 + c * 14} y={104 + r * 13} width={8} height={7} rx={1}
                fill={(r + c * 2) % 4 === 0 ? "#2a3d5c" : "#ffd98a"} opacity={0.7} />
            )),
          )}
          <rect y="236" width="400" height="24" fill="#08101c" />
        </>
      )}
      {variant === "tower" && (
        <>
          <rect x="90" y="40" width="80" height="190" fill={wall} />
          <rect x="90" y="40" width="80" height="10" fill={accent} />
          {windows(98, 60, 4, 9, 11, 10, 6, 8)}
          <rect x="200" y="75" width="95" height="155" fill={wall} />
          <rect x="200" y="75" width="95" height="10" fill={accent} />
          {windows(208, 95, 4, 7, 13, 10, 6, 9)}
        </>
      )}
      {variant === "lowrise" && (
        <>
          <rect x="50" y="110" width="140" height="120" fill={wall} />
          <rect x="50" y="110" width="140" height="9" fill={accent} />
          {windows(60, 128, 5, 4, 15, 14, 7, 10)}
          <rect x="215" y="135" width="135" height="95" fill={wall} />
          <rect x="215" y="135" width="135" height="9" fill={accent} />
          {windows(225, 152, 5, 3, 14, 14, 7, 10)}
          <circle cx="198" cy="214" r="14" fill={accent} opacity="0.35" />
          <circle cx="372" cy="218" r="11" fill={accent} opacity="0.35" />
        </>
      )}
      {variant === "loft" && (
        <>
          <rect x="70" y="70" width="260" height="160" fill={wall} />
          <rect x="70" y="70" width="260" height="10" fill={accent} />
          {windows(84, 92, 6, 4, 28, 22, 9, 12)}
          <rect x="70" y="214" width="260" height="16" fill={accent} opacity="0.5" />
        </>
      )}
      {variant === "plan" && (
        <g fill="none" stroke={accent} strokeWidth="3">
          <rect x="60" y="40" width="280" height="180" fill="#fff" />
          <line x1="190" y1="40" x2="190" y2="140" />
          <line x1="60" y1="140" x2="250" y2="140" />
          <line x1="250" y1="140" x2="250" y2="220" />
          <path d="M190 100 a24 24 0 0 1 24 24" strokeWidth="2" />
        </g>
      )}
      <rect y="228" width="400" height="32" fill="#2c3a2f" opacity="0.16" />
    </svg>
  );
}
