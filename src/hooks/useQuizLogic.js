import { useMemo, useState } from "react";

const categories = [
  { id: 19, title: "Math", subtitle: "Numbers and logic", icon: "1" },
  { id: 17, title: "Chemistry", subtitle: "Elements and reactions", icon: "2" },
  { id: 17, title: "Physics", subtitle: "Matter and motion", icon: "3" },
];

function useQuizLogic() {
  const [screen, setScreen] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [sessionResult, setSessionResult] = useState(null);
  const [history, setHistory] = useState(() => {
    const raw = localStorage.getItem("quiz-history");

    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });

  const summaryText = useMemo(() => {
    if (!sessionResult) return "";
    return `${sessionResult.score}/${sessionResult.total} in ${sessionResult.category}`;
  }, [sessionResult]);

  const startCategory = (category) => {
    setSelectedCategory(category);
    setScreen("quiz");
  };

  const completeQuiz = ({ score, total }) => {
    const item = {
      id: Date.now(),
      category: selectedCategory.title,
      score,
      total,
      playedAt: new Date().toLocaleDateString(),
    };

    const nextHistory = [item, ...history].slice(0, 6);
    setHistory(nextHistory);
    localStorage.setItem("quiz-history", JSON.stringify(nextHistory));
    setSessionResult(item);
    setScreen("result");
  };

  return {
    categories,
    screen,
    selectedCategory,
    sessionResult,
    history,
    summaryText,
    startCategory,
    completeQuiz,
    setScreen,
  };
}

export default useQuizLogic;
