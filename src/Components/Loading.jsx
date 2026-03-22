export default function Loading() {
  return (
    <div className="glass-card flex flex-col items-center gap-3 p-8">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-100 border-t-[#3101B9]" />
      <p className="text-sm font-medium text-slate-500">Loading questions...</p>
    </div>
  );
}