import { Router } from "express";
import { prisma } from "../prisma.js";
export const teamRouter = Router();
teamRouter.get("/:teamNumber", async (req, res) => {
    const teamNumber = Number(req.params.teamNumber);
    if (Number.isNaN(teamNumber)) {
        return res.status(400).json({ error: "Invalid team number" });
    }
    const team = await prisma.team.findFirst({
        where: { number: teamNumber },
        include: {
            entries: {
                include: { match: true, scout: true }
            }
        }
    });
    if (!team)
        return res.status(404).json({ error: "Team not found" });
    res.json(team);
});
