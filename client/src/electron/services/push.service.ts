import axios from "axios";
import { app } from "electron";
import FormData from "form-data";
import fs from "fs";
import path from "path";

import {
  getUnsyncedItems,
  markManySynced,
} from "../database/repositories/sync.repository.js";

import { markEmployeeSynced } from "../database/repositories/employees.repository.js";
import { markAttendanceSynced } from "../database/repositories/attendances.repository.js";
import { markLeaveSynced } from "../database/repositories/leaves.repository.js";
import { markTaskSynced } from "../database/repositories/tasks.repository.js";
import { markTaskCommentsSynced } from "../database/repositories/tasks_comments.repository.js";
import { markEmployeePhotoSynced } from "../database/repositories/employees_photos.repository.js";
import { markEmployeeDocumentSynced } from "../database/repositories/employees_documents.repository.js";

const API_URL = app.isPackaged
  ? "https://leather-works.onrender.com"
  : process.env.VITE_API_URL;

export async function pushPendingChanges() {
  console.log("PUSH SERVICE API URL:", API_URL);

  const pending = await getUnsyncedItems();

  if (!pending.length) return;

  console.log("ITEMS TO PUSH SYNC:", pending);

  const form = new FormData();

  const items = pending.map((item) => ({
    queueId: item._id,
    entity: item.entity,
    operation: item.operation,
    data: JSON.parse(item.payload),
  }));

  // Sync metadata
  form.append("items", JSON.stringify(items));

  // Attach files (photos + documents)
  for (const item of pending) {
    const data = JSON.parse(item.payload);

    switch (item.entity) {
      case "employee_photo": {
        const photoPath = path.join(app.getPath("userData"), data.photo_path);

        if (fs.existsSync(photoPath)) {
          form.append("employees_photos", fs.createReadStream(photoPath), {
            filename: data.photo_filename,
            contentType: data.photo_mime_type,
          });
        } else {
          console.error("PHOTO FILE MISSING:", photoPath);
        }

        break;
      }

      case "employee_document": {
        if (fs.existsSync(data.localPath)) {
          form.append(
            "employees_documents",
            fs.createReadStream(data.localPath),
            {
              filename: data.fileName,
              contentType: data.mimeType,
            }
          );
        } else {
          console.error("DOCUMENT FILE MISSING:", data.localPath);
        }

        break;
      }
    }
  }

  console.log("FORM TO SEND TO BACKEND:", form);

  const response = await axios.post(`${API_URL}/sync/push`, form, {
    headers: form.getHeaders(),
  });

  console.log("SYNC PUSH RESULT:", response.status);

  // Mark sync queue items as synced
  await markManySynced(response.data.synced);

  // Mark local entities as synced
  for (const item of pending) {
    if (!response.data.synced.includes(item._id)) continue;

    const data = JSON.parse(item.payload);

    switch (item.entity) {
      case "employee":
        await markEmployeeSynced(data._id);
        break;

      case "employee_photo":
        await markEmployeePhotoSynced(data.employeeId);
        break;

      case "employee_document":
        await markEmployeeDocumentSynced(data._id);
        break;

      case "attendance":
        await markAttendanceSynced(data._id);
        break;

      case "leave":
        await markLeaveSynced(data._id);
        break;

      case "task":
        await markTaskSynced(data._id);
        break;

      case "task_comment":
        await markTaskCommentsSynced(data._id);
        break;
    }
  }

  return response;
}
