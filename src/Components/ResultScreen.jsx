export default function ResultScreen({ result, onBackHome, summaryText }) {
  const points = result.score * 50;

  return (
    <section className="space-y-5">
      <div className="glass-card p-6 text-center">
        <p className="text-xs uppercase tracking-widest text-slate-500">Result</p>
        <h1 className="mt-1 text-4xl font-bold text-[#3101B9]">
          {result.score}/{result.total}
        </h1>
        <p className="mt-3 text-xl font-semibold text-[#3101B9]">Congratulations</p>
        <p className="mt-1 text-slate-500">You finished the {result.category} challenge.</p>
      </div>

      <div className="glass-card p-5 text-center">
        <p className="text-sm text-slate-500">Points earned</p>
        <p className="text-3xl font-bold text-[#3101B9]">+{points}</p>
        <p className="mt-2 text-sm text-slate-500">{summaryText}</p>
      </div>

      <button onClick={onBackHome} className="brand-button w-full py-4 text-lg font-semibold">
        Back to Home
      </button>
    </section>
  );
}
