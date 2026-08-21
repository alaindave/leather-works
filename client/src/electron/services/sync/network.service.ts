import axios from "axios";
import { app } from "electron";

const API_URL = app.isPackaged
  ? "https://leather-works.onrender.com"
  : process.env.VITE_API_URL;

export class NetworkService {
  static async canReachBackend(): Promise<boolean> {
    const maxWaitTime = 65_000; // 65 seconds
    const requestTimeout = 8_000; // 8 seconds per request
    const retryDelay = 3_000; // 3 seconds between attempts

    const startTime = Date.now();

    console.log(`CHECKING BACKEND AVAILABILITY: ${API_URL}/health`);

    while (Date.now() - startTime < maxWaitTime) {
      const elapsed = Date.now() - startTime;

      try {
        console.log(`WAKING BACKEND... (${Math.round(elapsed / 1000)}s)`);

        const response = await axios.get(`${API_URL}/health`, {
          timeout: requestTimeout,
        });

        if (response.status >= 200 && response.status < 300) {
          const wakeTime = Date.now() - startTime;

          console.log(
            `BACKEND AVAILABLE AFTER ${Math.round(wakeTime / 1000)}s`
          );

          return true;
        }
      } catch (error) {
        const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);

        console.log(`BACKEND NOT READY YET (${elapsedSeconds}s)`);
      }

      // Don't wait after the 65-second window.
      if (Date.now() - startTime >= maxWaitTime) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }

    console.error("BACKEND COULD NOT BE REACHED AFTER 65 SECONDS");

    return false;
  }
}
