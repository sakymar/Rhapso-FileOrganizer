import { ipcRenderer } from "electron";

export const renameByExtensions = sourceFolder => {
  ipcRenderer.send("extensionRename:start", sourceFolder);
};

export const renameByDate = dataForm => {
  ipcRenderer.send("dateRename:start", dataForm);
};
