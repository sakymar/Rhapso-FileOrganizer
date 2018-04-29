// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import videosReducer from './videos_reducer'; 

const rootReducer = combineReducers({
  series:videosReducer,
  router,
});

export default rootReducer;
