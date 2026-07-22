import { all, get, run } from "../db.js";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { randomUUID } from "crypto";
import { EMPLOYEE_DOCUMENTS_DIR } from "../../storage/directories.js";
import {
  EmployeeDocument,
  EmployeeDocumentType,
  UploadedEmployeeDocument,
} from "../../../shared/types/EmployeeDocuments.js";
import { addToSyncQueue } from "./sync.repository.js";

// Upload employee document
export async function uploadEmployeeDocument(
  file: UploadedEmployeeDocument
): Promise<EmployeeDocument> {
  const existing = await getEmployeeDocument(
    file.employeeId,
    file.documentType
  );

  const hash = crypto.createHash("sha256").update(file.buffer).digest("hex");

  const employeeFolder = path.join(
    EMPLOYEE_DOCUMENTS_DIR,
    file.employeeId,
    file.documentType
  );

  await fs.mkdir(employeeFolder, {
    recursive: true,
  });

  const extension = path.extname(file.name);

  let _id: string = randomUUID();
  let version = 1;
  let createdAt = new Date().toISOString();

  if (existing) {
    _id = existing._id;
    version = existing.version + 1;
    createdAt = existing.createdAt;

    try {
      await fs.unlink(existing.localPath);
    } catch {
      // Old file doesn't exist. Ignore.
    }
  }

  const fileName = `${file.employeeId}_${file.documentType}${extension}`;

  const localPath = path.join(employeeFolder, fileName);

  await fs.writeFile(localPath, file.buffer);

  const now = new Date().toISOString();

  const document: EmployeeDocument = {
    _id,
    employeeId: file.employeeId,
    uploadedBy: file.uploadedBy,
    documentType: file.documentType,
    originalName: file.name,
    fileName,
    localPath,
    mimeType: file.mimeType,
    fileSize: file.buffer.length,
    hash,
    version,
    needsUpload: 1,
    isDeleted: 0,
    createdAt,
    updatedAt: now,
  };

  await upsertEmployeeDocument(document);

  const syncPayload = {
    _id,
    employeeId: file.employeeId,
    uploadedBy: file.uploadedBy,
    documentType: file.documentType,
    localPath,
    originalName: file.name,
    fileName,
    mimeType: file.mimeType,
    fileSize: file.buffer.length,
    hash,
    version,
    isDeleted: 0,
    createdAt,
    updatedAt: now,
  };

  await addToSyncQueue({
    entity: "employee_document",
    entityId: document._id,
    operation: "create",
    payload: JSON.stringify(syncPayload),
  });

  return document;
}

// Upsert
export async function upsertEmployeeDocument(document: EmployeeDocument) {
  await run(
    `
    INSERT INTO employees_documents (
      _id,
      employeeId,
      uploadedBy,
      documentType,
      originalName,
      fileName,
      localPath,
      mimeType,
      fileSize,
      hash,
      version,
      needsUpload,
      createdAt,
      updatedAt
    )
    VALUES (?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

    ON CONFLICT(_id)
    DO UPDATE SET
      employeeId = excluded.employeeId,
      uploadedBy = excluded.uploadedBy,
      documentType = excluded.documentType,
      originalName = excluded.originalName,
      fileName = excluded.fileName,
      localPath = excluded.localPath,
      mimeType = excluded.mimeType,
      fileSize = excluded.fileSize,
      hash = excluded.hash,
      version = excluded.version,
      needsUpload = excluded.needsUpload,
      updatedAt = excluded.updatedAt
    `,
    [
      document._id,
      document.employeeId,
      document.uploadedBy,
      document.documentType,
      document.originalName,
      document.fileName,
      document.localPath,
      document.mimeType,
      document.fileSize,
      document.hash,
      document.version,
      document.needsUpload ? 1 : 0,
      document.createdAt,
      document.updatedAt,
    ]
  );
}

export async function getEmployeeDocument(
  employeeId: string,
  documentType: EmployeeDocumentType
) {
  return get<EmployeeDocument>(
    `
    SELECT *
    FROM employees_documents
    WHERE employeeId = ?
      AND documentType = ?
      AND isDeleted = 0
    LIMIT 1
    `,
    [employeeId, documentType]
  );
}

// Read
export async function getEmployeeDocumentById(id: string) {
  return get<EmployeeDocument>(
    `SELECT * FROM employees_documents WHERE _id = ?`,
    [id]
  );
}

export async function getEmployeeDocumentsByEmployee(employeeId: string) {
  return all<EmployeeDocument[]>(
    `
    SELECT *
    FROM employees_documents
    WHERE employeeId = ?
      AND isDeleted = 0
    ORDER BY createdAt DESC
    `,
    [employeeId]
  );
}

export async function getEmployeeDocumentsByType(
  employeeId: string,
  documentType: EmployeeDocumentType
) {
  return all<EmployeeDocument>(
    `
    SELECT *
    FROM employees_documents
    WHERE employeeId = ?
      AND documentType = ?
    `,
    [employeeId, documentType]
  );
}

export async function getAllEmployeeDocuments() {
  return all<EmployeeDocument>(
    `
    SELECT *
    FROM employees_documents
    ORDER BY updatedAt DESC
    `
  );
}

// Update
export async function updateEmployeeDocument(document: EmployeeDocument) {
  await run(
    `
    UPDATE employees_documents
    SET
      uploadedBy = ?,
      documentType = ?,
      originalName = ?,
      fileName = ?,
      localPath = ?,
      mimeType = ?,
      fileSize = ?,
      hash = ?,
      version = ?,
      needsUpload = ?,
      updatedAt = ?
    WHERE _id = ?
    `,
    [
      document.uploadedBy,
      document.documentType,
      document.originalName,
      document.fileName,
      document.localPath,
      document.mimeType,
      document.fileSize,
      document.hash,
      document.version,
      document.needsUpload ? 1 : 0,
      document.updatedAt,
      document._id,
    ]
  );
}

// Delete
export async function deleteEmployeeDocument(id: string) {
  await run(
    `
    UPDATE employees_documents
    SET
      isDeleted = 1,
      needsUpload = 1,
      updatedAt = CURRENT_TIMESTAMP
    WHERE _id = ?
    `,
    [id]
  );
}

// sync
export async function getUnsyncedEmployeeDocuments() {
  return all<EmployeeDocument>(
    `
    SELECT *
    FROM employees_documents
    WHERE needsUpload = 1
    ORDER BY updatedAt ASC
    `
  );
}

export async function markEmployeeDocumentUploaded(id: string) {
  await run(
    `
    UPDATE employees_documents
    SET
      needsUpload = 0,
      lastSyncedAt = CURRENT_TIMESTAMP
    WHERE _id = ?
    `,
    [id]
  );
}

export async function markEmployeeDocumentNeedsUpload(id: string) {
  await run(
    `
    UPDATE employees_documents
    SET
      needsUpload = 1
    WHERE _id = ?
    `,
    [id]
  );
}

export async function markEmployeeDocumentSynced(_id: string) {
  await run(
    `
      UPDATE employees_documents
      SET
        needsUpload = 0,
        lastSyncedAt = CURRENT_TIMESTAMP
      WHERE _id = ?
    `,
    [_id]
  );
}

export async function incrementDocumentVersion(id: string) {
  await run(
    `
    UPDATE employees_documents
    SET
      version = version + 1,
      needsUpload = 1,
    WHERE _id = ?
    `,
    [id]
  );
}
