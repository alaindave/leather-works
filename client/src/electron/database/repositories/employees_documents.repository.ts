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
} from "../../../common/types/EmployeeDocuments.js";
import { addToSyncQueue } from "./sync.repository.js";
import { getEmployeeById } from "./employees.repository.js";

// Upload employee document
export async function uploadEmployeeDocument(
  file: UploadedEmployeeDocument
): Promise<EmployeeDocument> {
  const existing = await getEmployeeDocument(
    file.employeeId,
    file.documentType
  );

  const hash = crypto.createHash("sha256").update(file.buffer).digest("hex");

  const employee = await getEmployeeById(file.employeeId);

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
  let createdAt = new Date().toISOString();

  if (existing) {
    _id = existing._id;
    createdAt = existing.createdAt;

    try {
      await fs.unlink(existing.localPath);
    } catch {
      // Old file doesn't exist. Ignore.
    }
  }

  const fileName = `${employee?.firstName}_${employee?.lastName}_${file.documentType}${extension}`;

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
    serverVersion: file.serverVersion ?? 0,
    needsUpload: 1,
    isDeleted: 0,
    createdAt,
    updatedAt: now,
  };

  await upsertEmployeeDocument(document);

  return document;
}

// Upsert employee document
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
        serverVersion,
        needsUpload,
        isDeleted,
        createdAt,
        updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

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
        serverVersion = excluded.serverVersion,
        needsUpload = excluded.needsUpload,
        isDeleted = excluded.isDeleted,
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
      document.serverVersion,
      document.needsUpload ? 1 : 0,
      document.isDeleted ? 1 : 0,
      document.createdAt,
      document.updatedAt,
    ]
  );

  await addToSyncQueue({
    entity: "employee_document",
    entityId: document._id,
    operation: document.isDeleted ? "delete" : "update",
    payload: JSON.stringify(document),
  });
}

// Get employee document
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

// Get employee document by ID
export async function getEmployeeDocumentById(id: string) {
  return get<EmployeeDocument>(
    `
      SELECT *
      FROM employees_documents
      WHERE _id = ?
    `,
    [id]
  );
}

// Get all employee documents for employee
export async function getEmployeeDocumentsByEmployee(employeeId: string) {
  return all<EmployeeDocument>(
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

// Get employee documents by type
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

// Get all employee documents
export async function getAllEmployeeDocuments() {
  return all<EmployeeDocument>(
    `
      SELECT *
      FROM employees_documents
      ORDER BY updatedAt DESC
    `
  );
}

// Update employee document
export async function updateEmployeeDocument(document: EmployeeDocument) {
  const now = new Date().toISOString();

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
        serverVersion = ?,
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
      document.serverVersion,
      document.needsUpload ? 1 : 0,
      now,
      document._id,
    ]
  );

  await addToSyncQueue({
    entity: "employee_document",
    entityId: document._id,
    operation: "update",
    payload: JSON.stringify({
      ...document,
      updatedAt: now,
    }),
  });
}

// Delete employee document
export async function deleteEmployeeDocument(id: string) {
  const now = new Date().toISOString();

  await run(
    `
      UPDATE employees_documents
      SET
        isDeleted = 1,
        needsUpload = 1,
        updatedAt = ?
      WHERE _id = ?
    `,
    [now, id]
  );

  await addToSyncQueue({
    entity: "employee_document",
    entityId: id,
    operation: "delete",
    payload: JSON.stringify({
      _id: id,
      isDeleted: 1,
      updatedAt: now,
    }),
  });
}

// Get unsynced employee documents
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

// Mark employee document uploaded
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

// Mark employee document needs upload
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

// Mark employee document synced
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
