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

// ============================================================
// Upload employee document
// ============================================================

export async function uploadEmployeeDocument(
  file: UploadedEmployeeDocument
): Promise<EmployeeDocument> {
  const companyId = file.companyId;

  if (!companyId) {
    throw new Error("Cannot upload employee document without companyId");
  }

  const existing = await getEmployeeDocument(
    companyId,
    file.employeeId,
    file.documentType
  );

  const hash = crypto.createHash("sha256").update(file.buffer).digest("hex");

  const employee = await getEmployeeById(companyId, file.employeeId);

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
    companyId,
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

// ============================================================
// Upsert employee document
// ============================================================

export async function upsertEmployeeDocument(document: EmployeeDocument) {
  const companyId = document.companyId;

  if (!companyId) {
    throw new Error("Cannot upsert employee document without companyId");
  }

  const incomingServerVersion = document.serverVersion ?? 0;

  const existing = await get<{
    serverVersion: number;
    needsUpload: number;
  }>(
    `
      SELECT
        serverVersion,
        needsUpload
      FROM employees_documents
      WHERE companyId = ?
        AND _id = ?
    `,
    [companyId, document._id]
  );

  // Do not overwrite a newer local/server version.
  if (existing && existing.serverVersion > incomingServerVersion) {
    return;
  }

  // Do not overwrite local changes that have not been synced.
  if (existing && existing.needsUpload === 1) {
    return;
  }

  await run(
    `
      INSERT INTO employees_documents (
        companyId,
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
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

      ON CONFLICT(_id)
      DO UPDATE SET
        companyId = excluded.companyId,
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
        createdAt = excluded.createdAt,
        updatedAt = excluded.updatedAt
    `,
    [
      companyId,
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
      incomingServerVersion,
      document.needsUpload ? 1 : 0,
      document.isDeleted ? 1 : 0,
      document.createdAt,
      document.updatedAt,
    ]
  );

  /*
   * IMPORTANT:
   * Remote/pulled documents should NOT be added to the sync queue.
   *
   * needsUpload === 1 means this document originated locally
   * and still needs to be uploaded.
   */
  if (document.needsUpload === 1) {
    await addToSyncQueue({
      companyId,
      entity: "employee_document",
      entityId: document._id,
      operation: document.isDeleted ? "delete" : "update",
      payload: JSON.stringify(document),
    });
  }
}

// ============================================================
// Get employee document
// ============================================================

export async function getEmployeeDocument(
  companyId: string,
  employeeId: string,
  documentType: EmployeeDocumentType
) {
  return get<EmployeeDocument>(
    `
      SELECT *
      FROM employees_documents
      WHERE companyId = ?
        AND employeeId = ?
        AND documentType = ?
        AND isDeleted = 0
      LIMIT 1
    `,
    [companyId, employeeId, documentType]
  );
}

// ============================================================
// Get employee document by ID
// ============================================================

export async function getEmployeeDocumentById(companyId: string, id: string) {
  return get<EmployeeDocument>(
    `
      SELECT *
      FROM employees_documents
      WHERE companyId = ?
        AND _id = ?
    `,
    [companyId, id]
  );
}

// ============================================================
// Get all employee documents for employee
// ============================================================

export async function getEmployeeDocumentsByEmployee(
  companyId: string,
  employeeId: string
) {
  return all<EmployeeDocument>(
    `
      SELECT *
      FROM employees_documents
      WHERE companyId = ?
        AND employeeId = ?
        AND isDeleted = 0
      ORDER BY createdAt DESC
    `,
    [companyId, employeeId]
  );
}

// ============================================================
// Get employee documents by type
// ============================================================

export async function getEmployeeDocumentsByType(
  companyId: string,
  employeeId: string,
  documentType: EmployeeDocumentType
) {
  return all<EmployeeDocument>(
    `
      SELECT *
      FROM employees_documents
      WHERE companyId = ?
        AND employeeId = ?
        AND documentType = ?
        AND isDeleted = 0
    `,
    [companyId, employeeId, documentType]
  );
}

// ============================================================
// Get all employee documents
// ============================================================

export async function getAllEmployeeDocuments(companyId: string) {
  return all<EmployeeDocument>(
    `
      SELECT *
      FROM employees_documents
      WHERE companyId = ?
      ORDER BY updatedAt DESC
    `,
    [companyId]
  );
}

// ============================================================
// Update employee document
// ============================================================

export async function updateEmployeeDocument(
  companyId: string,
  document: EmployeeDocument
) {
  if (!companyId) {
    throw new Error("Cannot update employee document without companyId");
  }

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
      WHERE companyId = ?
        AND _id = ?
        AND isDeleted = 0
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
      companyId,
      document._id,
    ]
  );

  await addToSyncQueue({
    companyId,
    entity: "employee_document",
    entityId: document._id,
    operation: "update",
    payload: JSON.stringify({
      ...document,
      companyId,
      updatedAt: now,
    }),
  });
}

// ============================================================
// Delete employee document
// ============================================================

export async function deleteEmployeeDocument(companyId: string, id: string) {
  const now = new Date().toISOString();

  const document = await getEmployeeDocumentById(companyId, id);

  if (!document) {
    return false;
  }

  await run(
    `
      UPDATE employees_documents
      SET
        isDeleted = 1,
        needsUpload = 1,
        updatedAt = ?
      WHERE companyId = ?
        AND _id = ?
    `,
    [now, companyId, id]
  );

  await addToSyncQueue({
    companyId,
    entity: "employee_document",
    entityId: id,
    operation: "delete",
    payload: JSON.stringify({
      companyId,
      _id: id,
      employeeId: document.employeeId,
      documentType: document.documentType,
      isDeleted: 1,
      updatedAt: now,
    }),
  });

  return true;
}

// ============================================================
// Get unsynced employee documents
// ============================================================

export async function getUnsyncedEmployeeDocuments(companyId: string) {
  return all<EmployeeDocument>(
    `
      SELECT *
      FROM employees_documents
      WHERE companyId = ?
        AND needsUpload = 1
      ORDER BY updatedAt ASC
    `,
    [companyId]
  );
}

// ============================================================
// Mark employee document uploaded
// ============================================================

export async function markEmployeeDocumentUploaded(
  companyId: string,
  id: string
) {
  await run(
    `
      UPDATE employees_documents
      SET
        needsUpload = 0,
        lastSyncedAt = CURRENT_TIMESTAMP
      WHERE companyId = ?
        AND _id = ?
    `,
    [companyId, id]
  );

  return true;
}

// ============================================================
// Mark employee document needs upload
// ============================================================

export async function markEmployeeDocumentNeedsUpload(
  companyId: string,
  id: string
) {
  await run(
    `
      UPDATE employees_documents
      SET
        needsUpload = 1
      WHERE companyId = ?
        AND _id = ?
    `,
    [companyId, id]
  );

  return true;
}

// ============================================================
// Mark employee document synced
// ============================================================

export async function markEmployeeDocumentSynced(
  companyId: string,
  _id: string
) {
  await run(
    `
      UPDATE employees_documents
      SET
        needsUpload = 0,
        lastSyncedAt = CURRENT_TIMESTAMP
      WHERE companyId = ?
        AND _id = ?
    `,
    [companyId, _id]
  );

  return true;
}
