import {ipcRenderer} from 'electron';

import { ADD_SERIE, ADD_SERIES, REMOVE_SERIE, REMOVE_ALL_SERIES, SERIE_RENAMED,PROGRESS } from "./types";


export const addSeries = series => dispatch => {
  ipcRenderer.send('series:added', series);
  //console.log("PASSAGE ADD SERIE");
  console.log("ACTION",series);
  ipcRenderer.once('metadata:complete', (event, seriesWithData) => {
    dispatch({type:ADD_SERIES, payload:seriesWithData})
  })
};



export const convertSeries = series => dispatch => {
  ipcRenderer.send('conversion:start', series);

  ipcRenderer.on('conversion:progress', (event,progress)=>{
    console.log(progress);
    dispatch({type:PROGRESS,payload:progress});
  })
  ipcRenderer.on('conversion:end', (event, series) => {
    dispatch({ type: SERIE_RENAMED, payload: series });
  });

};

export const showInFolder = outputPath => dispatch => {
  ipcRenderer.send('folder:open', outputPath);
};


export const removeSerie = serie => {
  return {
    type: REMOVE_SERIE,
    payload: serie
  };
};

export const removeAllSeries = () => {
  return {
    type: REMOVE_ALL_SERIES
  };
};
