export const checkOnline = async () => {
  try {
    await fetch("https://clients3.google.com/generate_204", {
      method: "GET",
      cache: "no-store",
      mode: "no-cors",
    });
    return true;
  } catch {
    return false;
  }
};
