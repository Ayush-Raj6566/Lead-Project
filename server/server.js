import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import leadsRouter from "./routes/leads.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ORIGIN || "http://localhost:5173";

app.use(cors({ origin: ORIGIN }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.use("/api/leads", leadsRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
