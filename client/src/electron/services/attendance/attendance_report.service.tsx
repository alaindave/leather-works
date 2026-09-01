import { dialog } from "electron";
import fs from "fs/promises";
import { renderToBuffer } from "@react-pdf/renderer";
import { getDailyAttendanceReport } from "../../database/repositories/attendances.repository.js";
import { AttendanceReportDocument } from "../../reports/attendance-report.js";
import { DailyAttendanceReport } from "../../../common/types/AttendanceReport.js";

export async function saveAttendanceReport(date: string) {
  /*
   * Get attendance + employee information
   */
  const rows = await getDailyAttendanceReport(date);

  /*
   * Convert records for PDF
  
   */
  const employees = rows.map((row) => ({
    employeeId: row.employeeId,
    matricule: row.matricule ?? "--",
    firstName: row.firstName ?? "",
    lastName: row.lastName ?? "",
    department: row.department ?? null,
    role: row.role ?? null,
    clockIn: row.clockIn ?? null,
    clockOut: row.clockOut ?? null,
    status: row.status ?? "ABSENT",
  }));

  const report: DailyAttendanceReport = {
    date,
    employees,
    company: {
      name: "AFRITAN",
      address: "10 Boulevard Melchior Ndadaye",
      city: "Bujumbura,Burundi",
    },
  };

  /*
   * Ask where to save the PDF.
   */
  const result = await dialog.showSaveDialog({
    title: "Enregistrer le rapport de présence",
    defaultPath: `rapport-presences-${date}.pdf`,
    filters: [
      {
        name: "PDF",
        extensions: ["pdf"],
      },
    ],
  });

  if (result.canceled || !result.filePath) {
    return {
      canceled: true,
    };
  }

  /*
   * Render PDF.
   */
  const pdfBuffer = await renderToBuffer(
    <AttendanceReportDocument report={report} />
  );

  /*
   * Save PDF.
   */
  await fs.writeFile(result.filePath, pdfBuffer);

  return {
    canceled: false,
    filePath: result.filePath,
  };
}
