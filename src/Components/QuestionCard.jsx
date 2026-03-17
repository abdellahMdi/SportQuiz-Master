import { useState } from "react";

export default function QuestionCard({ question }) {
  const [selected, setSelected] = useState(null);

  const handleAnswer = (answer) => {
    setSelected(answer);
  };

  const options = [...question.incorrect_answers, question.correct_answer];

  return (
    <div className="card p-3">
      <h5 dangerouslySetInnerHTML={{ __html: question.question }} />

      {options.map((option, index) => {
        let color = "";

        if (selected === option) {
          if (option === question.correct_answer) {
            color = "green";
          } else {
            color = "red";
          }
        }

        return (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            style={{
              margin: "5px",
              backgroundColor: color,
              color: "white",
            }}
            dangerouslySetInnerHTML={{ __html: option }}
          />
        );
      })}
    </div>
  );
}