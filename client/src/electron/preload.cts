const { contextBridge, ipcRenderer } = require("electron");

console.log(" Preload loaded!");

contextBridge.exposeInMainWorld("electron", {
  file: { save: (data: string) => ipcRenderer.invoke("save-file", data) },
  auth: {
    login: (credentials) => ipcRenderer.invoke("auth:login", credentials),
    logout: () => ipcRenderer.invoke("auth:logout"),
  },

  announcements: {
    createAnnouncement: (data) =>
      ipcRenderer.invoke("announcements:create", data),

    getAnnouncements: () => ipcRenderer.invoke("announcements:get"),

    onNew: (callback: (data: any) => void) => {
      const handler = (_: any, data: any) => {
        callback(data);
      };

      ipcRenderer.on("announcement:new", handler);

      return () => {
        ipcRenderer.removeListener("announcement:new", handler);
      };
    },
  },
} satisfies Window["electron"]);
