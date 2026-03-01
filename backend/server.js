import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "urban_ai_secret_key";

/* ===============================
   🔐 FAKE USER DATABASE
================================ */
const users = [
  {
    id: 1,
    username: "inspector",
    password: bcrypt.hashSync("Urban@1234", 8),
    role: "inspector"
  },
  {
    id: 2,
    username: "admin",
    password: bcrypt.hashSync("admin123", 8),
    role: "admin"
  }
];

/* ===============================
   🔐 LOGIN ROUTE
================================ */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid username"
    });
  }

  const validPassword = bcrypt.compareSync(password, user.password);

  if (!validPassword) {
    return res.status(401).json({
      success: false,
      message: "Incorrect password"
    });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    SECRET,
    { expiresIn: "2h" }
  );

  res.json({
    success: true,
    token,
    role: user.role
  });
});

/* ===============================
   🔐 TOKEN VERIFY MIDDLEWARE
================================ */
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = decoded;
    next();
  });
};

/* ===============================
   🧠 CITY ANALYSIS (PROTECTED)
================================ */
app.post("/analyze", verifyToken, (req, res) => {
  const { city } = req.body;

  const cityData = {
    Delhi: {
      stability: 68,
      traffic: 82,
      risk: "High",
      stress: "Severe",
      report:
        "Delhi faces high pollution levels, extreme traffic density, and seismic vulnerability. Immediate urban modernization required."
    },
    Mumbai: {
      stability: 74,
      traffic: 76,
      risk: "Moderate-High",
      stress: "High",
      report:
        "Mumbai experiences coastal flood risk, heavy rainfall pressure, and aging drainage infrastructure. Coastal defense upgrades recommended."
    },
    Chennai: {
      stability: 78,
      traffic: 63,
      risk: "Moderate",
      stress: "Low",
      report:
        "Chennai shows moderate cyclone vulnerability but improved water management. Disaster early-warning integration advised."
    },
    Bangalore: {
      stability: 81,
      traffic: 71,
      risk: "Moderate",
      stress: "Moderate",
      report:
        "Bangalore’s rapid urban growth causes water shortages and traffic congestion. Smart grid expansion recommended."
    }
  };

  const result = cityData[city];

  if (!result) {
    return res.status(404).json({ error: "City not found" });
  }

  res.json(result);
});

/* ===============================
   🔍 TEST ROUTES
================================ */
app.get("/", (req, res) => {
  res.send("UrbanShield AI Backend Running");
});

app.get("/test-users", (req, res) => {
  res.json(users.map(u => ({
    id: u.id,
    username: u.username,
    role: u.role
  })));
});

/* ===============================
   🚀 START SERVER
================================ */
app.listen(5000, () => {
  console.log("AI Backend running on http://localhost:5000");
});