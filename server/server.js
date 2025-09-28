// server/server.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import leadsRouter from "./routes/leads.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// Parse comma-separated ORIGIN list into an array (no spaces!)
const ALLOWED_ORIGINS = (process.env.ORIGIN || "http://localhost:5173")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

// Let cors echo back the requesting origin if it's in the list
app.use(cors({ origin: ALLOWED_ORIGINS }));

app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.use("/api/leads", leadsRouter);

// optional: express error handler for clearer messages
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err?.message || err);
  res.status(500).json({ error: err?.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
