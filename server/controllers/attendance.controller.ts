import type { Request, Response } from "express";
import { markAbsentEmployees } from "../services/markEmployeeAbsent.service.js";

export async function markAbsentEmployeesHandler(req: Request, res: Response) {
  console.log("ABSENCE SERVICE ROUTE HIT");
  try {
    const result = await markAbsentEmployees();

    console.log("MARK ABSENT SUCCESS", result);

    return res.status(200).json({
      success: true,
      message: "Employés absents marqués avec succès",
      data: result,
    });
  } catch (error) {
    console.error("ERROR MARKING EMPLOYEES ABSENT:", error);

    return res.status(500).json({
      success: false,
      message: "Impossible de marquer les employés absents",
    });
  }
}
