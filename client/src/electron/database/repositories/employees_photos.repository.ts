import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { get, run } from "../db.js";
import { getEmployeesPhotosDir } from "../../util/getEmployeesPhotosDir.util.js";
import Employee from "../../../shared/types/Employee.js";
import { addToSyncQueue } from "./sync.repository.js";

type UploadFile = {
  name: string;
  buffer: Buffer;
};

const EMPLOYEE_PHOTO_DIR = getEmployeesPhotosDir();

export async function uploadEmployeePhoto(
  employeeId: string,
  file: UploadFile
) {
  const employee = await get<Employee>(
    "SELECT * FROM employees WHERE _id = ?",
    [employeeId]
  );

  if (!employee) {
    throw new Error("Employee not found");
  }

  //Get extension
  const ext = path.extname(file.name).toLowerCase();

  //MIME type
  const mimeType =
    ext === ".png"
      ? "image/png"
      : ext === ".webp"
      ? "image/webp"
      : "image/jpeg";

  // Increment version
  const photoVersion = (employee.photo_version ?? 0) + 1;

  //  Filename
  const fileName = `${employeeId}${ext}`;

  const absolutePath = path.join(EMPLOYEE_PHOTO_DIR, fileName);
  const relativePath = path.join("afritan_employees_photos", fileName);

  // Hash of image contents
  const hash = crypto.createHash("sha256").update(file.buffer).digest("hex");

  const CURRENT_TIMESTAMP = new Date().toISOString();

  // Delete previous photo if the filename changed
  if (employee.photo_path && employee.photo_path !== relativePath) {
    try {
      await fs.unlink(
        path.join(path.dirname(EMPLOYEE_PHOTO_DIR), employee.photo_path)
      );
    } catch {
      // Ignore if file doesn't exist
    }
  }

  // Save photo locally
  await fs.writeFile(absolutePath, file.buffer);

  // Update employee metadata
  await run(
    `
    UPDATE employees
    SET
      photo_filename = ?,
      photo_path = ?,
      photo_version = ?,
      photo_hash = ?,
      photo_last_modified = ?,
      photo_mime_type = ?,
      photo_needs_upload = 1,
      updatedAt = ?
    WHERE _id = ?
    `,
    [
      fileName,
      relativePath,
      photoVersion,
      hash,
      CURRENT_TIMESTAMP,
      mimeType,
      CURRENT_TIMESTAMP,
      employeeId,
    ]
  );

  const syncPayload = {
    employeeId,
    photo_filename: fileName,
    photo_path: relativePath,
    photo_version: photoVersion,
    photo_hash: hash,
    photo_last_modified: CURRENT_TIMESTAMP,
    photo_mime_type: mimeType,
    updatedAt: CURRENT_TIMESTAMP,
  };

  console.log("PHOTO TO ADD TO SYNC QUEUE:", syncPayload);

  await addToSyncQueue({
    entity: "employee_photo",
    entityId: employeeId,
    operation: "update",
    payload: JSON.stringify(syncPayload),
  });

  return get<Employee>("SELECT * FROM employees WHERE _id = ?", [employeeId]);
}

export async function updateEmployeePhotoMetadata(
  _id: string,
  data: {
    photo_path: string;
    photo_filename: string;
    photo_version: number;
    photo_hash?: string | null;
    photo_mime_type?: string | null;
    photo_last_modified?: string | null;
  }
) {
  await run(
    `
    UPDATE employees
    SET
      photo_path=?,
      photo_filename=?,
      photo_version=?,
      photo_hash=?,
      photo_mime_type=?,
      photo_last_modified=?,
      photo_needs_upload=0
    WHERE _id=?
    `,
    [
      data.photo_path,
      data.photo_filename,
      data.photo_version,
      data.photo_hash ?? null,
      data.photo_mime_type ?? null,
      data.photo_last_modified ?? null,
      _id,
    ]
  );
}

export async function markEmployeePhotoSynced(employeeId: string) {
  await run(
    `
    UPDATE employees
    SET
      photo_needs_upload = 0
    WHERE _id = ?
    `,
    [employeeId]
  );
}
