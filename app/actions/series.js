import {ipcRenderer} from 'electron';

import { ADD_SERIE, ADD_SERIES, REMOVE_SERIE, REMOVE_ALL_SERIES, SERIE_RENAMED } from "./types";


export const addSeries = series => dispatch => {
  ipcRenderer.send('series:added', series);
  ipcRenderer.on('metadata:complete', (event, seriesWithData) => {
    dispatch({type:ADD_SERIES, payload:seriesWithData})
  })
};



export const convertSeries = series => dispatch => {
  ipcRenderer.send('conversion:start', series);

  ipcRenderer.on('conversion:end', (event, { serie, outputPath }) => {
    dispatch({ type: SERIE_RENAMED, payload: { ...serie, outputPath } });
  });

};

export const showInFolder = outputPath => dispatch => {
  ipcRenderer.send('folder:open', outputPath);
};


export const addSerie = serie => {
  console.log("passage action",serie);
  return {
    type: ADD_SERIE,
    payload: { ...serie }
  };
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
