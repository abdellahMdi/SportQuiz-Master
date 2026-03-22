export default function ProgressBar({ current, total }) {
  const safeTotal = Math.max(total, 1);
  const percent = Math.round((current / safeTotal) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span>Progress</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-purple-100">
        <div
          className="h-2 rounded-full bg-[#3101B9] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
