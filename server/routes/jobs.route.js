const express = require("express");
const router = express.Router();

router.post("/mark-absent", async (req, res) => {
  const secret = req.headers["x-cron-secret"];

  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const SystemJob = require("../models/systemJobModel");

  try {
    await SystemJob.findOneAndUpdate(
      {
        job: "markAbsentEmployees",
      },
      {
        job: "markAbsentEmployees",
        lastRun: new Date(),
        status: "success",
        message: "Absence check completed",
        updatedAt: new Date(),
      },
      {
        upsert: true,
      }
    );

    await markAbsentEmployees();

    console.log(`ABSENCE JOB COMPLETED - ${new Date().toISOString()}`);

    res.json({
      success: true,
    });
  } catch (error) {
    console.error("AN ERROR OCCURED WHILE MARKING EMPLOYEES ABSENT:", error);
    await SystemJob.findOneAndUpdate(
      {
        job: "markAbsentEmployees",
      },
      {
        lastRun: new Date(),
        status: "failed",
        message: error.message,
      },
      {
        upsert: true,
      }
    );

    res.status(500).json({
      success: false,
    });
  }
});

module.exports = router;
