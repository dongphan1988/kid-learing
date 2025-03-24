// File: components/MathQuiz.js

"use client";

import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';

export default function MathQuiz() {
  const [questions, setQuestions] = useState(generateQuestions());
  const [answers, setAnswers] = useState(Array(5).fill(""));
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(480);
  const [showHintIndex, setShowHintIndex] = useState(null);
  const childName = sessionStorage.getItem("childName") || "Bé";

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  function generateQuestions() {
    const ops = ["+", "-"];
    let newQuestions = [];
    while (newQuestions.length < 5) {
      const num1 = Math.floor(Math.random() * 100);
      const num2 = Math.floor(Math.random() * 100);
      const op = ops[Math.floor(Math.random() * ops.length)];
      if (op === "+" && num1 + num2 <= 100) {
        newQuestions.push({ num1, num2, op });
      } else if (op === "-" && num1 >= num2) {
        newQuestions.push({ num1, num2, op });
      }
    }
    return newQuestions;
  }

  function calculateAnswer(q) {
    return q.op === "+" ? q.num1 + q.num2 : q.num1 - q.num2;
  }

  function generateHint(q) {
    if (q.op === "+") {
      if (q.num1 < 10 && q.num2 < 10 && q.num1 + q.num2 < 10) {
        return `${childName} hãy tưởng tượng bằng cách đếm que: |`.repeat(q.num1) + ` + |`.repeat(q.num2) + ` = ${q.num1 + q.num2}`;
      } else if (q.num1 + q.num2 >= 10) {
        const toTen = 10 - q.num1;
        const remain = q.num2 - toTen;
        return `${childName} ơi, con hãy tách ra nhé: \n${q.num1} + ${toTen} = 10 và 10 + ${remain} = ${q.num1 + q.num2}`;
      }
    } else if (q.op === "-") {
      if (q.num1 >= q.num2) {
        return `${childName} hãy nghĩ rằng con đang có ${q.num1} cái kẹo, bây giờ lấy đi ${q.num2} cái thì còn bao nhiêu nhỉ?`;
      } else {
        const borrow = 10 + (q.num1 % 10);
        const remain = borrow - q.num2;
        return `${childName} hãy mượn 1 từ hàng chục nhé: \n${q.num1} trở thành ${borrow}, sau đó lấy ${q.num2} đi thì còn ${remain}`;
      }
    }
  }

  const handleChange = (e, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let correct = 0;
    questions.forEach((q, i) => {
      if (parseInt(answers[i]) === calculateAnswer(q)) {
        correct++;
      }
    });
    setScore(correct * 2);
  };

  const handleNewQuiz = () => {
    setQuestions(generateQuestions());
    setAnswers(Array(5).fill(""));
    setScore(null);
    setTimeLeft(480);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="container py-5" style={{ backgroundImage: 'url(/background.jpg)', backgroundSize: 'cover' }}>
      <motion.div className="p-4 bg-light rounded shadow text-center mb-4">
        <h2 style={{ color: 'green' }}>{childName} ơi, con bắt đầu làm bài nhé!</h2>
        <h4>Thời gian còn lại: {formatTime(timeLeft)}</h4>
      </motion.div>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
        {questions.map((q, i) => {
          const isCorrect = parseInt(answers[i]) === calculateAnswer(q);
          const hasAnswered = answers[i] !== "" && score !== null;
          return (
            <div key={i} className="mb-3">
              <h5>Câu {i + 1}: {q.num1} {q.op} {q.num2} = ?
                <button type="button" className="btn btn-warning btn-sm ms-2" onClick={() => setShowHintIndex(i)}>💡</button>
              </h5>
              <input
                type="number"
                className="form-control"
                value={answers[i]}
                onChange={(e) => handleChange(e, i)}
                required
              />
              {hasAnswered && (
                <motion.small
                  className={isCorrect ? "text-primary" : "text-danger"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  {isCorrect 
                    ? `${childName} tính đúng rồi, giỏi quá!!!`
                    : `${childName} ơi, con tính sai rồi. Đáp án là ${calculateAnswer(q)}. Bé hãy làm cẩn thận hơn nhé!`}
                </motion.small>
              )}
              {showHintIndex === i && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-2 mt-2 bg-light border rounded"
                >
                  {generateHint(q)}
                </motion.div>
              )}
            </div>
          );
        })}
        <button type="submit" className="btn btn-primary">Nộp Bài</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={handleNewQuiz}>Làm Bài Mới</button>
      </form>
    </div>
  );
}
