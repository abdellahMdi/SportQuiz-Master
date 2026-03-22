import { useMemo, useState } from "react";
import HomeScreen from "./Components/HomeScreen";
import QuizScreen from "./Components/QuizScreen";
import ResultScreen from "./Components/ResultScreen";
import ThemeToggle from "./Components/ThemeToggle";

const categories = [
  { id: 19, title: "Math", subtitle: "Numbers and logic", icon: "1" },
  { id: 17, title: "Chemistry", subtitle: "Elements and reactions", icon: "2" },
  { id: 17, title: "Physics", subtitle: "Matter and motion", icon: "3" },
];

function App() {
  const [screen, setScreen] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [sessionResult, setSessionResult] = useState(null);
  const [history, setHistory] = useState(() => {
    const raw = localStorage.getItem("quiz-history");
    return raw ? JSON.parse(raw) : [];
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

  return (
    <ThemeToggle>
      <main className="mx-auto min-h-screen w-full max-w-md p-4 sm:max-w-lg sm:p-6">
        {screen === "home" && (
          <HomeScreen
            categories={categories}
            history={history}
            onStart={startCategory}
          />
        )}

        {screen === "quiz" && (
          <QuizScreen
            category={selectedCategory}
            onQuit={() => setScreen("home")}
            onFinish={completeQuiz}
          />
        )}

        {screen === "result" && sessionResult && (
          <ResultScreen
            result={sessionResult}
            onBackHome={() => setScreen("home")}
            summaryText={summaryText}
          />
        )}
      </main>
    </ThemeToggle>
  );
}

export default App;
