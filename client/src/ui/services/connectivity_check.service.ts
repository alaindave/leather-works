const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const checkOnline = async (): Promise<boolean> => {
  try {
    await fetch(`${API_URL}/health`, {
      method: "GET",
      cache: "no-store",
      mode: "no-cors",
    });
    return true;
  } catch {
    return false;
  }
};
