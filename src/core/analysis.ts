import type { Team, ScoutEntry } from "@prisma/client";

type TeamWithEntries = Team & { entries: ScoutEntry[] };

export function computeEventRanking(teams: TeamWithEntries[]) {
  const scored = teams.map((t) => ({
    teamNumber: t.number,
    entries: t.entries.length,
    score: t.entries.length
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored;
}
