import HomeScreen from "./Components/HomeScreen";
import QuizScreen from "./Components/QuizScreen";
import ResultScreen from "./Components/ResultScreen";
import ThemeToggle from "./Components/ThemeToggle";
import useQuizLogic from "./hooks/useQuizLogic";

function App() {
  const {
    categories,
    screen,
    selectedCategory,
    sessionResult,
    history,
    summaryText,
    startCategory,
    completeQuiz,
    setScreen,
  } = useQuizLogic();

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
