// @flow
import React, { Component } from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import Routes from "./routes";
import { createBrowserHistory } from "history";
import { hot } from "react-hot-loader";

const history = createBrowserHistory();

class Root extends Component {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <Router history={history}>
          <Routes />
        </Router>
      </Provider>
    );
  }
}

const ExportedApp =
  process.env.NODE_ENV === "development"
    ? hot(module)(Root) // error is thrown by `hot`
    : Root;

export default ExportedApp;
