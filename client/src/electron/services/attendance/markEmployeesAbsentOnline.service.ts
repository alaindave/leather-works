import axios from "axios";
import { app } from "electron";

const API_URL = app.isPackaged
  ? "https://leather-works.onrender.com"
  : process.env.VITE_API_URL;

export async function markEmployeesAbsentOnline(date: string) {
  try {
    const response = await axios.post(`${API_URL}/attendances/mark-absent`, {
      date,
    });
    console.log("EMPLOYEES MARKED ABSENT", response.data);
    return response.data;
  } catch (e) {
    console.error("AN ERROR OCCURED WHILE MARKING EMPLOYEES ABSENT", e);
  }
}
