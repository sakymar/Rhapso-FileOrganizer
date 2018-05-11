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
import { app, BrowserWindow } from 'electron';
import MenuBuilder from './menu';
const fs = require('fs');
const mv = require('mv');
const parser = require('episode-parser');

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};


/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    title:"Rhapso-FileOrganizer",
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});

ipcMain.on('videos:added', (event, videos) => {
  const promises = _.map(videos, video => {
      return new Promise((resolve, reject) => {
          ffmpeg.ffprobe(video.path, (err,metadata) => {
              video.duration = metadata.format.duration;
              video.format='avi';
              console.log(video);
              resolve(video);
          });
      });
  });

  Promise.all(promises)
      .then((results) => {
          mainWindow.webContents.send('metadata:complete', results)
      });
});

ipcMain.on('conversion:start', (event,videos) => {
  console.log(videos);
  _.each(videos, video => {
      console.log(video);
      console.log('oui');

      let path = video.path;
      let outputDirectory = video.path.split(video.name)[0];
      let result = parser(video.name);
      console.log('test');
      console.log(result);
      let outputName = `${result.show} - Season ${result.season} Episode ${result.episode}.${result.ext}`;

      let outputPath = `${outputDirectory}${result.show}\\Season ${result.season}\\${outputName}`;
      console.log('test2');
      console.log(outputDirectory);
      console.log( outputName);
      console.log(outputPath);
      console.log(result);
      mv(video.path, outputPath,{mkdirp: true}, function (err) {
          if (err) throw err;
          mainWindow.webContents.send('conversion:end', { video, outputPath })
        });
  });

});

ipcMain.on('folder:open', (event, outputPath) => {
  shell.showItemInFolder(outputPath);
});