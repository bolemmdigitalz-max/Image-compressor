interface Props {
  value: number; // 0-100
  ariaLabel?: string;
}

export function ProgressBar({ value, ariaLabel }: Props) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
      aria-label={ariaLabel}
      className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
    >
      <div
        className="h-full rounded-full bg-blue-600 transition-[width] duration-150 ease-out"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}