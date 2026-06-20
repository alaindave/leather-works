import osUtils from "os-utils";
import fs from "fs";
import os from "os";

const POLLING_INTERVAL = 1000;

export function pollResources() {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getRamUsage();
    const storageData = getStorageData();
    const staticData = getStaticData();

    console.log({
      cpuUsage,
      ramUsage,
      storageUsage: storageData.usage,
      totalStorage: staticData.totalStorage,
    });
  }, POLLING_INTERVAL);
}

function getCpuUsage() {
  return new Promise((res) => {
    osUtils.cpuUsage(res);
  });
}

function getRamUsage() {
  return 1 - osUtils.freememPercentage();
}

function getStorageData() {
  const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;

  return {
    total: Math.floor(total / 1_000_000_000),
    usage: 1 - free / total,
  };
}

export function getStaticData() {
  const totalStorage = getStorageData().total;
  const cpuModel = os.cpus()[0].model;

  return { totalStorage, cpuModel };
}
