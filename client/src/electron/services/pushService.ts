import axios from "axios";
import { app } from "electron";

import {
  getUnsyncedItems,
  markManySynced,
} from "../database/repositories/sync.repository.js";
import { markEmployeeSynced } from "../database/repositories/employee.repository.js";
import { markAttendanceSynced } from "../database/repositories/attendance.repository.js";
import { markLeaveSynced } from "../database/repositories/leave.repository.js";

const API_URL = app.isPackaged
  ? "https://striking-celebration-production-5910.up.railway.app"
  : process.env.VITE_API_URL;

export async function pushPendingChanges() {
  const pending = await getUnsyncedItems();
  if (!pending.length) return;

  console.log("Items to push sync: ", pending);

  const response = await axios.post(`${API_URL}/sync/push`, {
    items: pending.map((item) => ({
      queueId: item._id,
      entity: item.entity,
      operation: item.operation,
      data: JSON.parse(item.payload),
    })),
  });

  await markManySynced(response.data.synced);

  for (const item of pending) {
    if (response.data.synced.includes(item._id)) {
      const data = JSON.parse(item.payload);

      switch (item.entity) {
        case "employee":
          await markEmployeeSynced(data._id);
          break;

        case "attendance":
          await markAttendanceSynced(data._id);
          break;

        case "leave":
          await markLeaveSynced(data._id);
          break;
      }
    }
  }

  return response;
}
