import React, { Component } from "react";
import Title from "../../components/Title";
import SelectFormat from "../../components/SelectFormat";
import { AppBar } from "@material-ui/core";
import TabNavigation from "../../components/TabNavigation";
import { I18n } from "react-redux-i18n";
import { Size, Date, Name, Extension } from "../Delete/tabs";

export default class Delete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: 0
    };
  }

  render() {
    const { tabIndex } = this.state;

    return (
      <div className="containerScreen">
        <AppBar
          style={{ backgroundColor: "transparent" }}
          position="static"
          color="default"
        >
          <TabNavigation
            labels={[
              I18n.t("bySize"),
              I18n.t("byDate"),
              I18n.t("byName"),
              I18n.t("byExtension")
            ]}
            onChange={tabIndex => this.setState({ tabIndex })}
            value={tabIndex}
          />
        </AppBar>
        {tabIndex === 0 && <Size />}
        {tabIndex === 1 && <Date />}
        {tabIndex === 2 && <Name />}
        {tabIndex === 3 && <Extension />}
      </div>
    );
  }
}
