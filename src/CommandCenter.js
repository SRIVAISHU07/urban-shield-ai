import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import "./App.css";
import CityMap from "./CityMap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
export default function CommandCenter() {
  const [city, setCity] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState([]);

  const cities = ["Mumbai", "Delhi", "Chennai", "Bangalore"];

  const speak = (text) => {
    if (!text) return;
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  };
  const typingRef = useRef(null);

const typeWriter = (text) => {
  if (!text) return;

  // stop previous typing
  if (typingRef.current) {
    clearInterval(typingRef.current);
  }

  let i = 0;

  typingRef.current = setInterval(() => {
    i++;
    setOutput(text.slice(0, i));

    if (i >= text.length) {
      clearInterval(typingRef.current);
    }
  }, 20);
};

  const extractStats = (text) => {
    const stability = text.match(/Infrastructure Stability: (\d+)%/)?.[1];
    const traffic = text.match(/Traffic Load Index: (\d+)%/)?.[1];
    const risk = text.match(/Failure Prediction Risk: (.*)/)?.[1];
    const stress = text.match(/Environmental Stress: (.*)/)?.[1];

    setStats({ stability, traffic, risk, stress });
  };

  const activateCity = async (cityName) => {
  if (!cityName) return;

  setCity(cityName);
  setLoading(true);
  setStats(null);
  setOutput("");

  try {
    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("token")
      },
      body: JSON.stringify({ city: cityName })
    });

    const data = await response.json();

    if (!response.ok) {
      setOutput(data.message || "Server error");
      setLoading(false);
      return;
    }

    // ✅ THIS IS THE IMPORTANT FIX
    setStats({
      stability: data.stability,
      traffic: data.traffic,
      risk: data.risk,
      stress: data.stress
    });
    setTrendData([
  { year: "2020", value: data.stability - 10 },
  { year: "2021", value: data.stability - 6 },
  { year: "2022", value: data.stability - 3 },
  { year: "2023", value: data.stability - 1 },
  { year: "2024", value: data.stability }
]);

    typeWriter(data.report);

  } catch (error) {
    console.error("Error:", error);
    setOutput("Error connecting to backend.");
  }

  setLoading(false);
};

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <h1>UrbanShield AI Command Center</h1>

        <select
          className="city-select"
          value={city}
          onChange={(e) => activateCity(e.target.value)}
        >
          <option value="">Select a City</option>
          {cities.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading && <p className="loading-text">Analyzing city intelligence...</p>}

      {/* STAT CARDS */}
      {stats && (
        <div className="stats-grid">
            <motion.div
  className={`stat-card ${
    stats?.risk?.toLowerCase().includes("high")
      ? "risk-high"
      : stats?.risk?.toLowerCase().includes("moderate")
      ? "risk-moderate"
      : "risk-low"
  }`}
>
  <h3>{stats.risk}</h3>
  <p>Failure Prediction Risk</p>
</motion.div>
          <motion.div className="stat-card" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
            <h3>{stats.stability}%</h3>
            <p>Infrastructure Stability</p>
          </motion.div>

          <motion.div className="stat-card" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
            <h3>{stats.traffic}%</h3>
            <p>Traffic Load Index</p>
          </motion.div>

          <motion.div className="stat-card" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
            <h3>{stats.risk}</h3>
            <p>Failure Prediction Risk</p>
          </motion.div>

          <motion.div className="stat-card" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
            <h3>{stats.stress}</h3>
            <p>Environmental Stress</p>
          </motion.div>
        </div>
      )}
      {trendData.length > 0 && (
  <div style={{ width: "90%", margin: "50px auto" }}>
    <h3 style={{ color: "#00eaff", textAlign: "center" }}>
      Stability Trend (Last 5 Years)
    </h3>

    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={trendData}>
        <XAxis dataKey="year" stroke="#aaa" />
        <YAxis stroke="#aaa" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#00eaff"
          strokeWidth={3}
          dot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}
      {/* AI REPORT PANEL */}
      {city && (
        <div className="output-panel">
          <h3>{city} Strategic AI Report</h3>
          <p>{output}</p>
          <span className="cursor">|</span>
        </div>
      )}
      {city && <CityMap city={city} />}
    </div>
  );
}