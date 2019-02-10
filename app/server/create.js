import { ipcMain } from "electron";
import { readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";
var readdirp = require("readdirp");

const isDirectory = path => statSync(path).isDirectory();
const getDirectories = path =>
  readdirSync(path)
    .map(name => join(path, name))
    .filter(isDirectory);

const isFile = path => statSync(path).isFile();
const getFiles = path =>
  readdirSync(path)
    .map(name => join(path, name))
    .filter(isFile);

const getFilesRecursively = path => {
  let dirs = getDirectories(path);
  let files = dirs
    .map(dir => getFilesRecursively(dir)) // go through each directory
    .reduce((a, b) => a.concat(b), []); // map returns a 2d array (array of file arrays) so flatten
  return files.concat(getFiles(path));
};

ipcMain.on("createList:start", (event, dataForm) => {
  console.log("PASSAGE SERV CREATE LIST", dataForm);
  let { nameFile, destinationFolder, sourceFolder } = dataForm;
  //sourceFolder = sourceFolder.replace("\\", "/");
  console.log(sourceFolder);
  let data = [];
  // console.log(getFilesRecursively(sourceFolder));
  readdirp({ root: sourceFolder })
    .on("data", function(entry) {
      data.push(entry);
    })
    .on("end", () => {
      console.log(data);
      let names = data.map(a => a.name);
      writeFileSync(join(sourceFolder, nameFile), names.join("\r\n"), "utf-8");
    });
});
