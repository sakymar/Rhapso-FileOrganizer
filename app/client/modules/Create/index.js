import React, { Component } from "react";
import Title from "../../components/Title";

import TabNavigation from "../../components/TabNavigation";
import MakeList from "./components/MakeList";

export default class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: 0,
      recursive: false,
      tabIndex: 0
    };
  }

  changeDestinationFolder = () => {
    let path = remote.dialog.showOpenDialog({
      properties: ["openDirectory"]
    });
    if (path) {
      path = path[0];
      this.setState({ sourceFolder: path });
    }
  };

  render() {
    const { format, tabIndex } = this.state;
    const options = [{ value: 0, label: "Make a List" }];
    return (
      <div className="containerScreen">
        <Title title="Create" />
        <TabNavigation
          labels={["Make a List"]}
          onChange={tabIndex => this.setState({ tabIndex })}
          value={tabIndex}
        />
        {tabIndex === 0 && <MakeList />}
      </div>
    );
  }
}
