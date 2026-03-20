import express from "express";
import cors from "cors";
import { env } from "./env.js";
import { prisma } from "./prisma.js";
import { scoutRouter } from "./routes/scout.js";
import { eventRouter } from "./routes/event.js";
import { teamRouter } from "./routes/team.js";
import { analysisRouter } from "./routes/analysis.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    if (req.method !== "GET" && env.API_KEY) {
        const key = req.headers["x-api-key"];
        if (key !== env.API_KEY) {
            return res.status(401).json({ error: "Unauthorized" });
        }
    }
    next();
});
app.get("/health", async (_req, res) => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        res.json({ ok: true });
    }
    catch {
        res.status(500).json({ ok: false });
    }
});
app.use("/api/scout", scoutRouter);
app.use("/api/event", eventRouter);
app.use("/api/team", teamRouter);
app.use("/api/analysis", analysisRouter);
app.listen(env.PORT, () => {
    console.log(`Server listening on ${env.PORT}`);
});
