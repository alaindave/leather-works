import fs from "fs";
import path from "path";
import { get, run } from "../db.js";
import { getEmployeePhotosDir } from "../../util/getEmployeesPhotoDir.js";
import Employee from "../../../shared/types/Employee.js";

type UploadFile = {
  name: string;
  buffer: Buffer;
};

const EMPLOYEE_PHOTO_DIR = getEmployeePhotosDir();

export async function uploadEmployeePhoto(
  employeeId: string,
  file: UploadFile
) {
  // Get employee
  const employee = await get<Employee>(
    "SELECT * FROM employees WHERE _id = ?",
    [employeeId]
  );

  if (!employee) {
    throw new Error("Employee not found");
  }

  // Generate unique filename
  const ext = path.extname(file.name);
  const fileName = `${employeeId}-${Date.now()}${ext}`;

  // Absolute path (used for saving to disk)
  const absolutePath = path.join(EMPLOYEE_PHOTO_DIR, fileName);

  // Relative path (stored in database)
  const relativePath = path.join("employee_photos", fileName);

  // Delete previous photo
  if (employee.photo_path) {
    const oldAbsolutePath = path.join(
      path.dirname(EMPLOYEE_PHOTO_DIR),
      employee.photo_path
    );

    if (fs.existsSync(oldAbsolutePath)) {
      fs.unlinkSync(oldAbsolutePath);
    }
  }

  // Save file
  fs.writeFileSync(absolutePath, file.buffer);

  // Store relative path
  await run(
    `
    UPDATE employees
    SET photo_path = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE _id = ?
    `,
    [relativePath, employeeId]
  );

  // Return updated employee
  return get<Employee>("SELECT * FROM employees WHERE _id = ?", [employeeId]);
}
