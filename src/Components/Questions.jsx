import getQuestions from '../../src/Data';
import '../Question.css';
import { useEffect, useState } from "react";
function SingelQuestion() {
  const [questions , setquestions]= useState([]);
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
  if (!questions.length) return <p>No questions found</p>;
  const allAnswers = [
    questions[0].correct_answer,
    ...questions[0].incorrect_answers,
  ];
 return (
    <div className="container_principale">
      <h1>Quiz App</h1>
      <div className="Question_container">
        {loading && <p>Loading...</p>}
        {!loading &&
          Array.isArray(questions) &&
          <div className='Questions'>
          <h1 className="Title">{questions[0].question}</h1>
          <div className="Answers_btn_container">
          {allAnswers.map((answer, index) => (
            <button key={index} className="answer_btn">
              {answer}
            </button>
          ))}
          <div className='buttons'>
           <button className='btn2'>Back</button> 
          <button className='btn'>Next</button>
          </div>
        </div>
          </div>
          
          }
      </div>
    </div>
  );
}
export default SingelQuestion;