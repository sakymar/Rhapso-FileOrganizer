import { ipcRenderer } from "electron";

export const renameByExtensions = sourceFolder => {
  ipcRenderer.send("extensionRename:start", sourceFolder);
};
