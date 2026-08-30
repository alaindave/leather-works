import cron from "node-cron";

import { markAbsentEmployees } from "../services/markEmployeeAbsent.service.js";

console.log("EMPLOYEE ABSENCE CRON JOB INITIALIZED");

cron.schedule(
  "00 09 * * *",
  async () => {
    try {
      const now = new Date();

      // Sunday = 0
      // Saturday = 6
      const dayOfWeek = now.getDay();

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        console.log("ABSENCE CHECK SKIPPED: WEEKEND");
        return;
      }

      await markAbsentEmployees();

      console.log("ABSENCE CHECK COMPLETED");
    } catch (error) {
      console.error("ABSENCE CHECK FAILED:", error);
    }
  },
  {
    timezone: "Africa/Bujumbura",
  }
);
