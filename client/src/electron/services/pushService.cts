import axios from "axios";
import { app } from "electron";

import {
  getUnsyncedItems,
  markManySynced,
} from "../database/repositories/sync.repository.cjs";

const API_URL = app.isPackaged
  ? "https://striking-celebration-production-5910.up.railway.app"
  : process.env.VITE_API_URL;

export async function pushPendingChanges() {
  const pending = await getUnsyncedItems();
  if (!pending.length) return;

  console.log("Items to sync: ", pending);

  const response = await axios.post(`${API_URL}/sync/push`, {
    items: pending.map((item) => ({
      queueId: item._id,
      entity: item.entity,
      operation: item.operation,
      data: JSON.parse(item.payload),
    })),
  });

  console.log("PUSH RESULT:", response);

  await markManySynced(response.data.synced);
}
