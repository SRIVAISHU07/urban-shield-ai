import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./App.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Invalid credentials");
      return;
    }

    if (data.success && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      navigate("/dashboard");
    } else {
      alert("Login failed. Please try again.");
    }

  } catch (error) {
    alert("Server not responding. Check backend.");
  }
};

  return (
    <div className="login-container">
      <div className="background-animated"></div>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="logo-title">UrbanShield AI</h1>
        <p className="subtitle">National Infrastructure Intelligence System</p>

        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
        >
          ENTER COMMAND CENTER
        </motion.button>
      </motion.div>
    </div>
  );
}