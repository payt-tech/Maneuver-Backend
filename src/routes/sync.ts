import express from "express";
import db from "../db";

const router = express.Router();

router.post("/upload", async (req, res) => {
  const { eventKey, scoutingData, pitData, scouters, timestamp } = req.body;

  const date = timestamp.split("T")[0];

  const files = [
    {
      path: `scouting-data/${eventKey}/${eventKey}_${date}.json`,
      file_type: "scouting",
      event_key: eventKey,
      timestamp,
      content: scoutingData
    },
    {
      path: `pit-scouting/${eventKey}/pit_${eventKey}_${date}.json`,
      file_type: "pit",
      event_key: eventKey,
      timestamp,
      content: pitData
    },
    {
      path: `scouters/scouters_${date}.json`,
      file_type: "scouters",
      event_key: null,
      timestamp,
      content: scouters
    }
  ];

  for (const file of files) {
    const exists = await db.query(
      "SELECT 1 FROM sync_files WHERE path = $1",
      [file.path]
    );

    if (exists.rowCount === 0) {
      await db.query(
        `INSERT INTO sync_files (path, file_type, event_key, timestamp, content)
         VALUES ($1, $2, $3, $4, $5)`,
        [file.path, file.file_type, file.event_key, file.timestamp, file.content]
      );
    }
  }

  res.json({ success: true });
});

export default router;
