import { ipcMain } from "electron";
import { readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";
var readdirp = require("readdirp");

ipcMain.on("createList:start", (event, dataForm) => {
  let { nameFile, destinationFolder, sourceFolder, recursive } = dataForm;
  let data = [];
  let options = {
    root: sourceFolder
  };
  if (!recursive) {
    options.depth = 0;
  }

  readdirp(options)
    .on("data", function(entry) {
      data.push(entry);
    })
    .on("end", () => {
      let names = data.map(a => a.name);
      writeFileSync(
        join(destinationFolder, nameFile),
        names.join("\r\n"),
        "utf-8"
      );
    });
});
