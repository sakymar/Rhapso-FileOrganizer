import { ipcMain } from "electron";
import { readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";
var readdirp = require("readdirp");

ipcMain.on("createList:start", (event, dataForm) => {
  let {
    nameFile,
    destinationFolder,
    sourceFolder,
    recursive,
    format
  } = dataForm;
  let data = [];
  let options = {
    root: sourceFolder
  };
  if (!recursive) {
    options.depth = 0;
  }

  readdirp(sourceFolder)
    .on("data", function(entry) {
      data.push(entry);
    })
    .on("end", () => {
      console.log("DATA", data);
      let names = data.map(a => a.basename);
      writeFileSync(
        join(destinationFolder, `${nameFile}.${format}`),
        names.join(format === "txt" ? "\r\n" : ","),
        "utf-8"
      );
    });
});
