import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../reducers";
import {
  loadTranslations,
  setLocale,
  syncTranslationWithStore
} from "react-redux-i18n";
import translation from "../i18n";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

syncTranslationWithStore(store);
store.dispatch(loadTranslations(translation));
store.dispatch(setLocale("en"));

export default store;
