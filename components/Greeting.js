// File: components/Greeting.js

"use client";

import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import MathQuiz from "./MathQuiz";

export default function Greeting() {
  const [childName, setChildName] = useState("");
  const [companionName, setCompanionName] = useState("");
  const [showGreeting, setShowGreeting] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showMathQuiz, setShowMathQuiz] = useState(false);

  useEffect(() => {
    const savedChildName = sessionStorage.getItem("childName");
    const savedCompanionName = sessionStorage.getItem("companionName");
    if (savedChildName && savedCompanionName) {
      setChildName(savedChildName);
      setCompanionName(savedCompanionName);
      setShowGreeting(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (childName && companionName) {
      sessionStorage.setItem("childName", childName);
      sessionStorage.setItem("companionName", companionName);
      setShowGreeting(true);
    } else {
      alert("Vui lòng nhập đầy đủ tên của bé và người đồng hành!");
    }
  };

  const handleSubjectSelect = (subject) => {
    if (subject === "Toán") {
      setShowMathQuiz(true);
    } else {
      alert("Môn khác đang được phát triển!");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setChildName("");
    setCompanionName("");
    setShowGreeting(false);
    setSelectedSubject("");
    setShowMathQuiz(false);
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
      {showMathQuiz ? (
        <MathQuiz />
      ) : !showGreeting ? (
        <motion.form
          className="bg-white p-5 rounded-4 shadow-lg w-100"
          style={{ maxWidth: "400px" }}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-center mb-4 fw-bold text-primary">Chào mừng đến với lớp học!</h2>

          <div className="mb-3">
            <label className="form-label fw-semibold">Tên của bé:</label>
            <input
              type="text"
              placeholder="Nhập tên của bé"
              className="form-control"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Tên người đồng hành:</label>
            <input
              type="text"
              placeholder="Nhập tên người đồng hành"
              className="form-control"
              value={companionName}
              onChange={(e) => setCompanionName(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2"
          >
            Bắt đầu học
          </button>
        </motion.form>
      ) : !selectedSubject ? (
        <motion.div
          className="text-center bg-white p-5 rounded-4 shadow-lg mt-4"
          style={{ maxWidth: "400px" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 fw-bold text-success">Xin chào, {childName}!</h2>
          <p className="fs-5 text-muted">
            {companionName} sẽ đồng hành cùng con trong buổi học hôm nay. Hãy cùng học thật vui nhé!
          </p>

          <h3 className="mb-4 fw-bold text-primary">Chọn môn học</h3>
          <button
            className="btn btn-outline-primary w-100 mb-2"
            onClick={() => handleSubjectSelect("Toán")}
          >
            Môn Toán
          </button>
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => alert("Môn khác đang được phát triển!")}
          >
            Môn khác
          </button>

          <button
            className="btn btn-danger w-100 mt-3"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </motion.div>
      ) : (
        <div className="text-center">
          <h2>Bạn đã chọn môn {selectedSubject}</h2>
          <button
            className="btn btn-danger mt-3"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}