import { ipcRenderer } from "electron";

export const createList = createListDataForm => {
  ipcRenderer.send("createList:start", createListDataForm);
};
