const API_URL = import.meta.env.VITE_API_URL;
const RETRY_WINDOW = 60_000; // 60 seconds
const RETRY_INTERVAL = 5_000; // retry every 5 seconds
const REQUEST_TIMEOUT = 10_000; // individual backend request timeout

const hasInternetAccess = async (): Promise<boolean> => {
  if (navigator.onLine) {
    console.log("THE BROWSER REPORTS BEING ONLINE.");
    return true;
  } else {
    console.log("THE BROWSER REPORTS BEING OFFLINE.");
    return false;
  }
};

export const checkOnline = async (): Promise<boolean> => {
  const hasInternet = await hasInternetAccess();

  if (!hasInternet) {
    console.log("NO INTERNET CONNECTION. BACKEND CHECK SKIPPED.");

    return false;
  }

  const startTime = Date.now();

  console.log(`CHECKING BACKEND: ${API_URL}/health`);

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
          console.log("BACKEND AVAILABLE.");

          return true;
        }

        console.log(`BACKEND RETURNED STATUS ${response.status}.`);
      } finally {
        clearTimeout(timeout);
      }
    } catch {
      const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);

      console.log(`BACKEND NOT READY YET (${elapsedSeconds}s).`);
    }

    if (Date.now() - startTime >= RETRY_WINDOW) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
  }

  console.error("BACKEND COULD NOT BE REACHED AFTER 60 SECONDS.");

  return false;
};
