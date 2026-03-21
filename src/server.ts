import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import { env } from "./env.js";
import { prisma } from "./prisma.js";
import { scoutRouter } from "./routes/scout.js";
import { eventRouter } from "./routes/event.js";
import { teamRouter } from "./routes/team.js";
import { analysisRouter } from "./routes/analysis.js";
import syncRoutes from "./routes/sync.js";

const app = express();
app.use("/api/sync", syncRoutes);
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (req.method !== "GET" && env.MANEUVER_API_KEY) {
    const key = req.headers["x-api-key"];
    if (key !== env.MANEUVER_API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }
  next();
});

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
});

app.use("/api/scout", scoutRouter);
app.use("/api/event", eventRouter);
app.use("/api/team", teamRouter);
app.use("/api/analysis", analysisRouter);

// -----------------------------
// Render‑safe startup wrapper
// -----------------------------
async function start() {
  try {
    // Ensure Prisma connects before server starts
    await prisma.$connect();
    await db.query(`
    CREATE TABLE IF NOT EXISTS sync_files (
    id SERIAL PRIMARY KEY,
    path TEXT UNIQUE NOT NULL,
    event_key TEXT,
    file_type TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    content JSONB NOT NULL
  );
`);


    console.log("Connected to database");

    // OPTIONAL: If you want schema sync on every boot (Render Free Tier)
    // await prisma.$executeRawUnsafe(`SELECT 1`);

    app.listen(env.PORT, () => {
      console.log(`Server listening on ${env.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
 
