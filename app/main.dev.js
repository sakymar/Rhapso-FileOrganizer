/* eslint global-require: 0, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, ipcMain } from "electron";
import * as Splashscreen from "@trodi/electron-splashscreen";

require("electron-reload")(__dirname, {
  electron: require("${__dirname}/../../node_modules/electron")
});

import MenuBuilder from "./menu";
const fs = require("fs");
const mv = require("mv");
const parser = require("episode-parser");

let mainWindow = null;
let splashWindow = null;

if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require("source-map-support");
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === "development" ||
  process.env.DEBUG_PROD === "true"
) {
  require("electron-debug")();
  const path = require("path");
  const p = path.join(__dirname, "..", "app", "node_modules");
  require("module").globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require("electron-devtools-installer");
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ["REACT_DEVELOPER_TOOLS", "REDUX_DEVTOOLS"];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("ready", async () => {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.DEBUG_PROD === "true"
  ) {
    await installExtensions();
  }

  if (process.platform === "darwin") {
    mainWindow = new BrowserWindow({
      show: false,
      width: 1200,
      darkTheme: true,
      frame: true,
      titleBarStyle: "hidden",
      height: 700,
      title: "Rhapso-FileOrganizer"
    });
  } else {
    mainWindow = new BrowserWindow({
      show: false,
      width: 1200,
      darkTheme: true,
      frame: false,
      height: 700,
      title: "Rhapso-FileOrganizer"
    });
  }

  splashWindow = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    frame: false,
    webPreferences: {
      devTools: false
    }
  });
  splashWindow.loadURL(`file://${__dirname}/splashScreen.html`);
  splashWindow.focus();
  mainWindow.loadURL(`file://${__dirname}/app.html`);
  splashWindow.focus();

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  ipcMain.on("loaded", () => {
    console.log("PASSAGE RECEIVE");
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (splashWindow) {
      splashWindow.destroy();
    }
    splashWindow = null;

    mainWindow.show();
    //mainWindow.focus();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});

ipcMain.on("series:added", (event, videos) => {
  console.log(videos);
  let { series, destinationFolder } = videos;

  series.forEach(video => {
    let path = video.path;

    let outputDirectory = video.path.split(video.name)[0];
    console.log(outputDirectory);
    if (destinationFolder != "") {
      outputDirectory = `${destinationFolder}\\`;
    }
    console.log(outputDirectory);
    let result;
    try {
      result = parser(video.name);
    } catch (err) {
      console.log(err);
      return err;
    }
    if (result) {
      //console.log("test");
      //console.log(result);
      let outputName = `${result.show} - Season ${result.season} Episode ${result.episode}.${result.ext}`;

      let outputPath = `${outputDirectory}${result.show}\\Season ${result.season}\\${outputName}`;
      //console.log("test2");
      //console.log(outputDirectory);
      //console.log(outputName);
      //console.log(outputPath);
      //console.log(result);
      video.outputPath = outputPath;
      video.outputName = outputName;
    } else {
      video.outputPath = video.path;
      video.outputName = video.name;
      video.error = true;
    }
  });
  console.log("PASSAGE VIDEO");
  mainWindow.webContents.send("metadata:complete", series);
});

ipcMain.on("conversion:start", (event, videos) => {
  if (videos && videos.length > 0) {
    videos.forEach((video, index) => {
      if (video && !video.renamed && video.path && video.outputPath) {
        mv(video.path, video.outputPath, { mkdirp: true }, function(err) {
          if (err) throw err;
        });
      }

      mainWindow.webContents.send("conversion:progress", index / videos.length);

      video.renamed = true;
    });
  }
  mainWindow.webContents.send("conversion:end", {
    videos
  });
});

ipcMain.on("folder:open", (event, outputPath) => {
  shell.showItemInFolder(outputPath);
});

import "./server/create";
import "./server/rename";
