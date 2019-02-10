import { ipcRenderer } from "electron";

export const createList = createListDataForm => {
  console.log("PASSAGE ACTION", createListDataForm);
  ipcRenderer.send("createList:start", createListDataForm);
  //   ipcRenderer.on("createList:end", length => {
  //     return length;
  //   });
};
