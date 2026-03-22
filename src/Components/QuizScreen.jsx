import { useCallback, useEffect, useMemo, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import Timer from "./Timer";
import { fetchQuestions } from "../services/api";

const QUESTION_LIMIT = 20;
const TIMER_SECONDS = 25;

export default function QuizScreen({ category, onFinish, onQuit }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hintUsed, setHintUsed] = useState(false);
  const [hiddenOptions, setHiddenOptions] = useState([]);

  const currentQuestion = questions[currentIndex];

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchQuestions({ amount: QUESTION_LIMIT, categoryId: category.id });
      setQuestions(data);
      setCurrentIndex(0);
      setSelected("");
      setScore(0);
      setHintUsed(false);
      setHiddenOptions([]);
    } catch {
      setError("Unable to load quiz questions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [category.id]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const goNext = useCallback(() => {
    setSelected("");
    setHiddenOptions([]);

    if (currentIndex + 1 >= questions.length) {
      onFinish({ score, total: questions.length });
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, onFinish, questions.length, score]);

  const handleSelect = (answer) => {
    if (selected) return;

    setSelected(answer);
    if (answer === currentQuestion.correctAnswer) {
      setScore((previous) => previous + 1);
    }
  };

  const handleTimeout = useCallback(() => {
    if (!selected) {
      setSelected("__timeout__");
    }
  }, [selected]);

  const useHint = () => {
    if (hintUsed || selected) return;

    const wrongAnswers = currentQuestion.options.filter(
      (option) => option !== currentQuestion.correctAnswer
    );

    setHiddenOptions(wrongAnswers.slice(0, 2));
    setHintUsed(true);
  };

  const questionCounter = useMemo(() => `${currentIndex + 1}/${questions.length}`, [currentIndex, questions.length]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={loadQuestions} />;
  if (!currentQuestion) return null;

  return (
    <section className="space-y-4">
      <header className="glass-card flex items-center justify-between p-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Category</p>
          <h1 className="text-2xl font-bold text-[#3101B9]">{category.title}</h1>
        </div>
        <div className="space-y-2 text-right">
          <p className="rounded-2xl bg-[#F3E8FF] px-3 py-2 font-semibold text-[#3101B9]">{questionCounter}</p>
          <p className="text-xs font-semibold text-slate-500">Score {score}</p>
        </div>
      </header>

      <div className="glass-card space-y-4 p-4">
        <div className="flex items-center justify-between gap-4">
          <Timer key={`${currentIndex}-${selected}`} duration={TIMER_SECONDS} onTimeout={handleTimeout} />
          <button
            onClick={useHint}
            disabled={hintUsed || Boolean(selected)}
            className="rounded-2xl border border-purple-200 bg-[#F3E8FF] px-4 py-2 text-sm font-semibold text-[#3101B9] disabled:cursor-not-allowed disabled:opacity-50"
          >
            50/50 Hint
          </button>
        </div>

        <ProgressBar current={currentIndex + 1} total={questions.length} />
      </div>

      <QuestionCard
        question={currentQuestion}
        selected={selected === "__timeout__" ? "" : selected}
        onSelect={handleSelect}
        disabled={selected === "__timeout__"}
        hiddenOptions={hiddenOptions}
      />

      <div className="grid grid-cols-2 gap-3">
        <button onClick={onQuit} className="rounded-2xl border border-purple-200 bg-white px-4 py-3 font-semibold text-slate-600">
          Back
        </button>
        <button
          onClick={goNext}
          disabled={!selected}
          className="brand-button px-4 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {currentIndex + 1 === questions.length ? "Finish" : "Next"}
        </button>
      </div>

      <p className="text-center text-sm font-semibold text-[#3101B9]">Score: {score}</p>
    </section>
  );
}
