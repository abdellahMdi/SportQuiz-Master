export default function QuestionCard({
  question,
  selected,
  onSelect,
  disabled,
  hiddenOptions,
}) {
  const resolveState = (option) => {
    if (!selected) {
      return "bg-white border-purple-200 text-slate-700 hover:border-[#3101B9]";
    }

    if (option === question.correctAnswer) {
      return "bg-green-500 border-green-500 text-white";
    }

    if (option === selected && option !== question.correctAnswer) {
      return "bg-red-500 border-red-500 text-white";
    }

    return "bg-slate-100 border-slate-100 text-slate-400";
  };

  return (
    <div className="glass-card space-y-5 p-5">
      <h2 className="text-left text-xl font-semibold text-[#3101B9]">{question.question}</h2>

      <div className="grid gap-3">
        {question.options.map((option) => {
          if (hiddenOptions.includes(option)) {
            return null;
          }

          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              disabled={Boolean(selected) || disabled}
              aria-label={`Answer option ${option}`}
              className={`rounded-2xl border p-3 text-left font-medium transition ${resolveState(option)} ${
                selected ? "cursor-not-allowed" : ""
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}