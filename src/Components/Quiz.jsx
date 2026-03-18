import { useState, useEffect } from "react";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";
import QuestionCard from "./QuestionCard";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple"
      );

      if (!res.ok) {
        throw new Error("API error");
      }

      const data = await res.json();
      setQuestions(data.results);
    } catch (err) {
      setError("Impossible de charger les questions.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      {questions.length > 0 && <QuestionCard question={questions[0]} />}
    </div>
  );
}