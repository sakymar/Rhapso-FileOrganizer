import React, { Component } from "react";
import { AppBar } from "@material-ui/core";
import TabNavigation from "../../components/TabNavigation";
import { I18n } from "react-redux-i18n";
import { Date, Name, Extension, Media } from "./Tabs";

export default class Rename extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: 0
    };
  }

  render() {
    const { tabIndex } = this.state;
    // const notif = new Notification("test");

    return (
      <div className="containerScreen">
        <AppBar
          style={{ backgroundColor: "transparent" }}
          position="static"
          color="default"
        >
          <TabNavigation
            labels={[
              I18n.t("byDate"),
              I18n.t("byExtension"),
              I18n.t("byMediaFormat")
            ]}
            onChange={tabIndex => this.setState({ tabIndex })}
            value={tabIndex}
          />
        </AppBar>
        {tabIndex === 0 && <Date />}
        {/* {tabIndex === 1 && <Name />} */}
        {tabIndex === 1 && <Extension />}
        {tabIndex === 2 && <Media />}
      </div>
    );
  }
}
