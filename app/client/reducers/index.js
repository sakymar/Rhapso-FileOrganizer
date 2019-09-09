// @flow
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import videos_reducer from "./videos_reducer";
import { i18nReducer } from "react-redux-i18n";

export default function createRootReducer(history) {
  return combineReducers<{}, *>({
    videos: videos_reducer,
    i18n: i18nReducer
  });
}
