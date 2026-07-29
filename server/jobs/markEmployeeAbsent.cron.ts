import cron from "node-cron";
import { markAbsentEmployees } from "../services/markEmployeeAbsent.service.js";

console.log("EMPLOYEE ABSENCE CRON JOB INITIALIZED");
cron.schedule(
  "10 02 * * *",
  async () => {
    try {
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
