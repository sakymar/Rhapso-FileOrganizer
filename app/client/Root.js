// @flow
import React, { Component } from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import Routes from "./routes";
import { createBrowserHistory } from "history";
import { hot } from "react-hot-loader";
import { ThemeProvider } from "styled-components";
import themes from "./theme";
import settings from "electron-settings";

//Lancement de l'handler
import jobsHandler from "./services/JobsHandler";
import { ipcRenderer } from "electron";

const history = createBrowserHistory();

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: true
    };
  }

  componentDidMount() {
    ipcRenderer.send("loaded");
  }

  render() {
    const { store } = this.props;
    const { isDarkMode } = this.state;

    const observer = settings.watch("theme", function handler(newValue) {
      this.setState({ isDarkMode: newValue });
    });
    observer.dispose();

    return (
      <Provider store={store}>
        <ThemeProvider
          theme={isDarkMode === "dark" ? themes.darkTheme : themes.lightTheme}
        >
          <Router history={history}>
            <Routes style={{ color: "black" }} />
          </Router>
        </ThemeProvider>
      </Provider>
    );
  }
}

const ExportedApp =
  process.env.NODE_ENV === "development"
    ? hot(module)(Root) // error is thrown by `hot`
    : Root;

export default ExportedApp;
