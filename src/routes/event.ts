import { Router } from "express";
import { prisma } from "../prisma.js";
import { getEventMatches } from "../integrations/nexus.js";

export const eventRouter = Router();

eventRouter.get("/:eventKey/matches", async (req, res) => {
  const { eventKey } = req.params;

  const externalMatches = await getEventMatches(eventKey);

  const dbMatches = await prisma.match.findMany({
    where: { eventKey },
    include: {
      entries: {
        include: { scout: true, team: true }
      }
    }
  });

  res.json({ externalMatches, dbMatches });
});
