import { Router } from "express";
import { prisma } from "../prisma.js";
import { z } from "zod";
export const scoutRouter = Router();
const ScoutEntrySchema = z.object({
    scoutName: z.string(),
    teamNumber: z.number(),
    eventKey: z.string(),
    matchKey: z.string(),
    payload: z.record(z.any())
});
scoutRouter.post("/", async (req, res) => {
    const parsed = ScoutEntrySchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    const { scoutName, teamNumber, eventKey, matchKey, payload } = parsed.data;
    const scout = await prisma.scout.upsert({
        where: { name: scoutName },
        update: {},
        create: { name: scoutName }
    });
    const team = await prisma.team.upsert({
        where: { number: teamNumber },
        update: { eventKey },
        create: { number: teamNumber, eventKey }
    });
    const match = await prisma.match.upsert({
        where: { event_match: { eventKey, matchKey } },
        update: {},
        create: { eventKey, matchKey }
    });
    const entry = await prisma.scoutEntry.create({
        data: {
            scoutId: scout.id,
            teamId: team.id,
            matchId: match.id,
            payload
        }
    });
    res.json({ success: true, id: entry.id });
});
