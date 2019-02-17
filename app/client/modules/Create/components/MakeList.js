import React, { Component } from "react";
import styled from "styled-components";
import { Checkbox, Button, TextField } from "@material-ui/core";
import electron, { remote, dialog } from "electron";
import { createList } from "../actions";

const MakeListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white !important;
  font-family: Opensans;
  font-size: 14px;

  input {
    color: white !important;
  }

  p {
    font-size: 14px !important;
  }

  .row {
    display: flex;
    flex-direction: row;
    width: 70%;
    justify-content: space-between;
    align-items: center;
    margin-top: 80px;
  }

  .rowItem {
    display: flex;
    flex-direction: row;
    width: 30%;
    align-items: center;
  }

  .rowItem p {
    margin-left: 10px;
  }

  .submitButton {
    color: white;
    background-color: #f76d3a;
  }

  .separator {
    width: 50%;
    margin-top: 100px;
    margin-bottom: 20px;
    color: white;
    border-width: 0.5px !important;
  }

  .inputNameFile {
    border-bottom: 1px solid white !important;
  }
`;

export default class MakeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: 0,
      recursive: false,
      sourceFolder: "Not defined",
      destinationFolder: "Not defined"
    };
  }

  changeDestinationFolder = field => {
    let path = remote.dialog.showOpenDialog({
      properties: ["openDirectory"]
    });
    if (path) {
      path = path[0];
      if (
        this.state.destinationFolder === "Not defined" &&
        field !== "destinationFolder"
      ) {
        this.setState({ [field]: path, destinationFolder: path });
      } else {
        this.setState({ [field]: path });
      }
    }
  };

  render() {
    const {
      format,
      recursive,
      nameFile,
      sourceFolder,
      destinationFolder
    } = this.state;
    return (
      <MakeListContainer>
        <div className="row">
          <div className="rowItem">
            <Button
              className="submitButton"
              onClick={() => this.changeDestinationFolder("sourceFolder")}
            >
              Source Folder
            </Button>
            <p>{sourceFolder}</p>
          </div>

          <div className="rowItem">
            <Button
              className="submitButton"
              onClick={() => this.changeDestinationFolder("destinationFolder")}
            >
              Destination Folder
            </Button>
            <p>{destinationFolder}</p>
          </div>
        </div>

        <div className="row">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Checkbox
              checked={recursive}
              style={{ color: "white" }}
              onChange={() =>
                this.setState({
                  recursive: !recursive
                })
              }
            />
            <p>Include sub-directories</p>
          </div>
          <div>
            <p>Name of the file</p>
            <TextField
              className="inputNameFile"
              value={this.state.nameFile}
              onChange={e => this.setState({ nameFile: e.target.value })}
            />
          </div>
        </div>
        <hr className="separator" />
        <Button className="submitButton" onClick={() => createList(this.state)}>
          Validate
        </Button>
      </MakeListContainer>
    );
  }
}
