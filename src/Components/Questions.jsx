import getQuestions from "../Data/data";
import "../question.css";
import { useEffect, useState } from "react";

function SingelQuestion() {
  const [questions, setquestions] = useState([]);
  const [value, setvalue] = useState({
    indece: 0,
    score: 0,
  });

  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading...</p>;
  if (!questions.length) return <p>No questions found</p>
  const currentQuestion = questions[value.indece];
  const allAnswers = [
    currentQuestion.correct_answer,
    ...currentQuestion.incorrect_answers,
  ];

//   const isCorrect = answer === currentQuestion.correct_answer;
const handleClick = (answer) => {
  if (answer === currentQuestion.correct_answer) {
    setvalue((prev) => ({
      ...prev,
      score: prev.score + 1,
      indece: prev.indece < questions.length - 1
        ? prev.indece + 1
        : prev.indece,
    }));
  } else {
    setvalue((prev) => ({
      ...prev,
      indece: prev.indece < questions.length - 1
        ? prev.indece + 1
        : prev.indece,
    }));
  }
};
  return (
    <div className="container_principale">
    return <h1>Score: {value.score}</h1>;
      <h1>Quiz App</h1> 
      <div className="Question_container">
        <h2 className="Title">
          {currentQuestion.question}
        </h2>
        <div className="Answers_btn_container">
          {allAnswers.map((answer, index) => (
            <button onClick={ () => handleClick(answer)} key={index} className="answer_btn">
              {answer}
            </button>
          ))}
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