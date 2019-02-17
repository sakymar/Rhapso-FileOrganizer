import { ipcMain } from "electron";
import { join } from "path";
import moment from "moment";
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

const valueToMoment = {
  0: date => moment(date).format("YYYY"),
  1: date => moment(date).format("MMMM"),
  2: date => `Week - ${moment(date).format("w")}`,
  3: date => `Day - ${moment(date).format("D")}`,
  4: date => `${moment(date).format("D")}h`
};

ipcMain.on("dateRename:start", (event, dataForm) => {
  const { sourceFolder, destinationFolder, formatDate, recursive } = dataForm;
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
      data.forEach(file => {
        let fileName = file.name;
        let extension = file.name.split(".").pop();
        let newPath = "";
        console.log("STAT", file.stat);
        console.log("FORM DATES", formatDate);
        console.log("STAT TIME", file.stat.mtime);
        formatDate.forEach(date => {
          newPath = `${newPath}/${valueToMoment[date](file.stat.mtime)}`;
        });
        newPath = `${newPath}/${fileName}`;
        console.log(newPath);
        mv(
          file.fullPath,
          join(destinationFolder, newPath),
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
