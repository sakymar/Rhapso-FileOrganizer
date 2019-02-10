import React, { Component } from "react";
import Title from "../../components/Title";
import SelectFormat from "../../components/SelectFormat";
import { Checkbox, Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { createList } from "./actions";
import electron, { remote, dialog } from "electron";

export default class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: 0,
      recursive: false
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
    const { format } = this.state;
    const options = [{ value: 0, label: "Make a List" }];
    return (
      <div className="containerScreen">
        <Title title="Create" />
        <SelectFormat
          value={format}
          onChange={value => this.setState({ format: value })}
          options={options}
          style={{
            color: "white",
            minWidth: 300,
            borderBottom: "1px solid white",
            marginLeft: 30,
            fontSize: 16
          }}
          classes={{ icon: { color: "white" } }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white"
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Checkbox
              checked={this.state.recursive}
              onChange={() =>
                this.setState({
                  recursive: !this.state.recursive
                })
              }
            />
            <p>Include sub-directories</p>
          </div>
          <Button
            style={{ color: "white", backgroundColor: "red" }}
            onClick={this.changeDestinationFolder}
          >
            Destination Folder
          </Button>
          <p>Name of the file</p>
          <TextField
            value={this.state.nameFile}
            style={{ color: "white" }}
            onChange={e => this.setState({ nameFile: e.target.value })}
          />
          <Button
            style={{ color: "white", backgroundColor: "red" }}
            onClick={() => createList(this.state)}
          >
            Ok
          </Button>
        </div>
      </div>
    );
  }
}
