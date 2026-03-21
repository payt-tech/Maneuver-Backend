export function computeEventRanking(teams) {
    const scored = teams.map((t) => ({
        teamNumber: t.number,
        entries: t.entries.length,
        score: t.entries.length
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored;
}
