import { ipcMain } from "electron";
import { join } from "path";
var readdirp = require("readdirp");
const mv = require("mv");

ipcMain.on("extensionRename:start", (event, sourceFolder) => {
  console.log("PASSAGE SERV CREATE LIST", sourceFolder);
  console.log(sourceFolder);
  let data = [];
  readdirp({ root: sourceFolder })
    .on("data", function(entry) {
      console.log(entry);
      data.push(entry);
    })
    .on("end", () => {
      data.forEach(file => {
        let fileName = file.name;
        let extension = file.name.split(".").pop();
        console.log(file.fullPath);
        console.log(join(sourceFolder, `${extension}/${fileName}`));
        mv(
          file.fullPath,
          join(sourceFolder, `${extension}/${fileName}`),
          {
            mkdirp: true
          },
          function(err) {
            if (err) throw err;
          }
        );
      });
    });
});
