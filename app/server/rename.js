import { ipcMain } from "electron";
import { join } from "path";
import moment from "moment";
var readdirp = require("readdirp");
const mv = require("mv");

ipcMain.on("extensionRename:start", (event, sourceFolder) => {
  let data = [];
  readdirp({ root: sourceFolder })
    .on("data", function(entry) {
      data.push(entry);
    })
    .on("end", () => {
      data.forEach(file => {
        let fileName = file.name;
        let extension = file.name.split(".").pop();
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
        formatDate.forEach(date => {
          newPath = `${newPath}/${valueToMoment[date](file.stat.mtime)}`;
        });
        newPath = `${newPath}/${fileName}`;
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

ipcMain.on("renameFiles:start", (event, files) => {
  files.forEach(file => {
    mv(
      file.path,
      file.outputPath,
      {
        mkdirp: true
      },
      function(err) {
        if (err) throw err;
      }
    );
  });
});
