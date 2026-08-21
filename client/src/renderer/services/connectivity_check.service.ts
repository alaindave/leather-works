const API_URL = import.meta.env.VITE_API_URL;
const RETRY_WINDOW = 60_000; // 60 seconds
const RETRY_INTERVAL = 5_000; // retry every 5 seconds
const REQUEST_TIMEOUT = 10_000; // individual request timeout

export const checkOnline = async (): Promise<boolean> => {
  const startTime = Date.now();

  while (Date.now() - startTime < RETRY_WINDOW) {
    try {
      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, REQUEST_TIMEOUT);

      try {
        const response = await fetch(`${API_URL}/health`, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        if (response.ok) {
          return true;
        }
      } finally {
        clearTimeout(timeout);
      }
    } catch {
      // Backend may still be waking up.
    }

    // Wait before trying again.
    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
  }

  return false;
};
