import { app } from "electron";

// Create menu template
export const mainMenuTemplate = [
  {
    label: "Fichier",
    submenu: [
      {
        label: "Quitter",
        click: () => app.quit(),
        accelerator: "CmdOrCtrl+w",
      },
    ],
  },
];
