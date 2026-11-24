
const express = require("express");
const mongoose = require("mongoose");
const os = require("os");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

// MongoDB Schema
const calculationSchema = new mongoose.Schema({
  principal: Number,
  rate: Number,
  months: Number,
  emi: Number,
  servedBy: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Calculation = mongoose.model(
  "Calculation",
  calculationSchema
);

// Pod information
function getPodInfo() {
  const interfaces = os.networkInterfaces();
  let ip = process.env.POD_IP || "localhost";

  if (!process.env.POD_IP) {
    for (const name of Object.keys(interfaces)) {
      for (const network of interfaces[name] || []) {
        if (network.family === "IPv4" && !network.internal) {
          ip = network.address;
          break;
        }
      }
      if (ip !== "localhost") break;
    }
  }

  return {
    name: process.env.HOSTNAME || "local-machine",
    ip
  };
}

// Health endpoint
app.get("/health", (req, res) => {
  if (mongoose.connection.readyState === 1) {
    return res.status(200).json({ status: "healthy" });
  }

  return res.status(503).json({ status: "MongoDB unavailable" });
});

// Calculate EMI
app.post("/api/emi", async (req, res) => {
  try {
    const P = Number(req.body.P);
    const rate = Number(req.body.rate);
    const n = Number(req.body.n);

    if (
      !Number.isFinite(P) ||
      !Number.isFinite(rate) ||
      !Number.isFinite(n) ||
      P <= 0 ||
      rate <= 0 ||
      n <= 0 ||
      !Number.isInteger(n)
    ) {
      return res.status(400).json({
        error: "Enter positive loan amount, interest rate and whole months."
      });
    }

    const r = rate / 12 / 100;

    const emi =
      (P * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    const pod = getPodInfo();

    const calculation = new Calculation({
      principal: P,
      rate,
      months: n,
      emi: Number(emi.toFixed(2)),
      servedBy: pod.name
    });

    await calculation.save();

    res.json({
      emi: Number(emi.toFixed(2)),
      totalPayment: Number(totalPayment.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      podName: pod.name,
      podIp: pod.ip
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Calculation could not be saved." });
  }
});

// Last 10 calculations
app.get("/api/history", async (req, res) => {
  try {
    const history = await Calculation.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve history." });
  }
});

// Connect MongoDB with retry
async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    setTimeout(connectMongo, 5000);
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectMongo();
});
