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
            <div key={i} className="mb-3 d-flex flex-column align-items-start">
              <div className="d-flex align-items-center">
                <button className="btn btn-light border me-2">Câu {i + 1}</button>
                <div className="d-flex align-items-center bg-light p-2 rounded" style={{ width: "100%" }}>
                  <span className="fs-5 me-2">{`${q.num1} ${q.op} ${q.num2} =`}</span>
                  <input
                    type="number"
                    className="form-control text-center"
                    style={{ width: "80px" }}
                    value={answers[i]}
                    onChange={(e) => handleChange(e, i)}
                    required
                  />
                </div>
              </div>
              {hasAnswered && (
                <motion.small
                  className={isCorrect ? "text-primary" : "text-danger"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  {isCorrect ? `${childName} tính đúng rồi, giỏi quá!!!` : `${childName} ơi, con tính sai rồi. Đáp án là ${calculateAnswer(q)}`}
                </motion.small>
              )}
            </div>
          );
        })}
        <button type="submit" className="btn btn-primary w-100">Nộp Bài</button>
      </form>
      {score !== null && (
        <motion.div
          className="mt-4 p-3 bg-light text-center rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3>Điểm của bạn: {score} / 10</h3>
          <button className="btn btn-secondary mt-3" onClick={handleNewQuiz}>Tạo Bài Mới</button>
        </motion.div>
      )}
    </div>
  );
}