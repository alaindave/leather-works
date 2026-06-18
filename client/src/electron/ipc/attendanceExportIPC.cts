import { ipcMain, dialog } from "electron";
import fs from "fs";

export function registerAttendanceExportIPC() {
  //Attendance file export
  ipcMain.handle("save-file", async (_, fileContent) => {
    const { filePath } = await dialog.showSaveDialog({
      title: "Enregistrer le rapport de présence",
      defaultPath: `rapport-présence-${new Date().toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}`,
      filters: [
        { name: "Text Files", extensions: ["txt"] },
        { name: "JSON Files", extensions: ["json"] },
        { name: "CSV Files", extensions: ["csv"] },
        { name: "All Files", extensions: ["*"] },
      ],
    });

    if (!filePath) return { success: false };

    fs.writeFileSync(filePath, fileContent);
    return { success: true, filePath };
  });
}
