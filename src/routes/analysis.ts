import { Router } from "express";
import { prisma } from "../prisma.js";
import { computeEventRanking } from "../core/analysis.js";

export const analysisRouter = Router();

analysisRouter.get("/event/:eventKey/picklist", async (req, res) => {
  const { eventKey } = req.params;

  const teams = await prisma.team.findMany({
    where: { eventKey },
    include: { entries: true }
  });

  const ranking = computeEventRanking(teams);
  res.json(ranking);
});
