import SyncCounter from "../models/syncCounter.model.js";

export async function getNextSyncVersion(entity: string): Promise<number> {
  const counter = await SyncCounter.findOneAndUpdate(
    { _id: entity },
    {
      $inc: {
        value: 1,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  ).lean();

  if (!counter) {
    throw new Error(`FAILED TO GENERATE NEXT VERSION FOR${entity}`);
  }

  return counter.value;
}
