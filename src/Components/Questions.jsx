import getQuestions from "../Data/data";
import "../question.css";
import { useEffect, useState } from "react";

function SingelQuestion() {
  const [questions, setquestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [value, setvalue] = useState({
    indece: 0,
    score: 0,
  });
  const [loading, setLoading] = useState(true);

  // shuffle function
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    getQuestions()
      .then((data) => {
        setquestions(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  // shuffle answers when question changes
  useEffect(() => {
    if (questions.length > 0) {
      const current = questions[value.indece];
      const answers = [
        current.correct_answer,
        ...current.incorrect_answers,
      ];
      setShuffledAnswers(shuffleArray(answers));
      setSelectedAnswer(null);
    }
  }, [value.indece, questions]);

  if (loading) return <p>Loading...</p>;
  if (!questions.length) return <p>No questions found</p>;

  const currentQuestion = questions[value.indece];

  const handleClick = (answer) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion.correct_answer) {
      setvalue((prev) => ({
        ...prev,
        score: prev.score + 1,
      }));
    }
  };

  return (
    <div className="container_principale">
      <h1 className="score">Score: {value.score}</h1>

      <h1>Quiz App</h1>

      <div className="Question_container">
        <p className="progress">
        Question {value.indece + 1} / {questions.length}
        </p>
        <h2 className="Title">{currentQuestion.question}</h2>

        <div className="Answers_btn_container">
          {shuffledAnswers.map((answer, index) => {
            let bgColor = "";

            if (selectedAnswer === answer) {
              bgColor =
                answer === currentQuestion.correct_answer
                  ? "green"
                  : "red";
            }

            return (
              <button
                key={index}
                onClick={() => handleClick(answer)}
                className="answer_btn"
                style={{ backgroundColor: bgColor }}
              >
                {answer}
              </button>
            );
          })}
        </div>

        <div className="buttons">
          <button
            className="btn"
            onClick={() =>
              setvalue((prev) => ({
                ...prev,
                indece:
                  prev.indece < questions.length - 1
                    ? prev.indece + 1
                    : 0,
              }))
            }
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
export default SingelQuestion;