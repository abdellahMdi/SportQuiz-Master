export default function HomeScreen({ categories, history, onStart }) {
  return (
    <section className="space-y-5">
      <header className="glass-card flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-slate-500">Welcome back</p>
          <h1 className="text-2xl font-bold text-[#3101B9]">SportQuiz Master</h1>
        </div>
        <div className="grid h-12 w-12 place-content-center rounded-2xl bg-[#3101B9] font-bold text-white">
          IQ
        </div>
      </header>

      <div className="glass-card overflow-hidden p-5">
        <div className="rounded-3xl bg-gradient-to-r from-[#3101B9] to-[#6D28D9] p-6 text-left text-white">
          <p className="text-sm uppercase tracking-widest text-purple-200">Daily challenge</p>
          <h2 className="text-3xl font-bold">Play and Win</h2>
          <p className="mt-2 text-sm text-purple-100">Answer fast, climb the board, and collect points.</p>
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#3101B9]">Categories</h3>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {categories.map((category) => (
            <button
              key={category.title}
              onClick={() => onStart(category)}
              className="rounded-3xl border border-purple-200 bg-[#F3E8FF] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#3101B9]"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">{category.subtitle}</p>
              <p className="mt-1 text-lg font-bold text-[#3101B9]">{category.title}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="mb-3 text-left text-lg font-semibold text-[#3101B9]">Recent Activity</h3>

        <ul className="space-y-2">
          {history.length === 0 && (
            <li className="rounded-2xl bg-[#F3E8FF] p-3 text-left text-sm text-slate-500">
              No recent games yet. Start your first quiz.
            </li>
          )}

          {history.map((item) => (
            <li key={item.id} className="flex items-center justify-between rounded-2xl bg-[#F3E8FF] p-3 text-sm">
              <div className="text-left">
                <p className="font-semibold text-[#3101B9]">{item.category}</p>
                <p className="text-slate-500">{item.playedAt}</p>
              </div>
              <p className="rounded-xl bg-white px-3 py-1 font-bold text-[#3101B9]">
                {item.score}/{item.total}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
