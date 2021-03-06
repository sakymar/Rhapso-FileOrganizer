import React, { Component } from "react";
import styled from "styled-components";
import {
  Checkbox,
  Button,
  TextField,
  Select,
  MenuItem
} from "@material-ui/core";
import electron, { remote, dialog } from "electron";
import { createList } from "../actions";
import { I18n } from "react-redux-i18n";
import SaveButton from "../../../components/SaveButton";

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
      format: "txt",
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
        <div
          className="row"
          style={{ backgroundColor: "white", color: "black" }}
        >
          <p>{I18n.t("makeList.format")}</p>
          <Select
            inputProps={{
              name: "format",
              id: "format"
            }}
            value={format}
            onChange={event => this.setState({ format: event.target.value })}
          >
            <MenuItem value="txt">Text</MenuItem>
            <MenuItem value="csv">CSV</MenuItem>
          </Select>
        </div>
        <Button className="submitButton" onClick={() => createList(this.state)}>
          Validate
        </Button>
        <SaveButton
          data={{
            ...this.state,
            sourceFolders: [sourceFolder],
            type: "List",
            action: "Create",
            active: false
          }}
        />
      </MakeListContainer>
    );
  }
}
