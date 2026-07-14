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

const API_URL = app.isPackaged
  ? "https://leather-works.onrender.com"
  : process.env.VITE_API_URL;

export async function pushPendingChanges() {
  console.log("PUSH SERVICE API URL:", API_URL);

  const pending = await getUnsyncedItems();

  if (!pending.length) return;

  console.log("ITEMS TO PUSH SYNC: ", pending);

  const form = new FormData();

  const items = pending.map((item) => ({
    queueId: item._id,
    entity: item.entity,
    operation: item.operation,
    data: JSON.parse(item.payload),
  }));

  // Add sync metadata
  form.append("items", JSON.stringify(items));

  // Add photo files
  for (const item of pending) {
    if (item.entity === "employee_photo") {
      const data = JSON.parse(item.payload);
      const photoPath = path.join(app.getPath("userData"), data.photo_path);

      if (fs.existsSync(photoPath)) {
        form.append(
          "afritan_employees_photos",
          fs.createReadStream(photoPath),
          {
            filename: data.photo_filename,
          }
        );
      } else {
        console.error("PHOTO FILE MISSING:", photoPath);
      }
    }
  }

  console.log("FORM TO SEND TO BACKEND:", form);
  const response = await axios.post(`${API_URL}/sync/push`, form, {
    headers: form.getHeaders(),
  });
  console.log("SYNC PUSH RESULT", response.status);

  // Mark entities synced in sync queue
  await markManySynced(response.data.synced);

  // Mark entities synced locally
  for (const item of pending) {
    if (response.data.synced.includes(item._id)) {
      const data = JSON.parse(item.payload);

      switch (item.entity) {
        case "employee":
          await markEmployeeSynced(data._id);
          break;

        case "employee_photo":
          await markEmployeePhotoSynced(data.employeeId);
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
  }

  return response;
}
