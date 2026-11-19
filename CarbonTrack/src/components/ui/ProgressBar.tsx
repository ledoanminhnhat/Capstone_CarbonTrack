/** Thanh tiến độ gradient; done = màu cam (hoàn thành). */
export default function ProgressBar({
  value,
  max = 100,
  done = false,
  className = "h-2",
}: {
  value: number;
  max?: number;
  done?: boolean;
  className?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className={`bg-soft rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all ${done ? "bg-gradient-sunrise" : "bg-gradient-leaf"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
