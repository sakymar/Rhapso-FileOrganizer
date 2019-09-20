import React, { Component } from "react";
import { connect } from "react-redux";
import { remote } from "electron";
import SerieList from "../components/SerieList";
import fs from "fs";
import Button from "../../../components/Button";

import { renameFiles } from "../actions";
import { Switch, FormControlLabel, Checkbox } from "@material-ui/core";
import ptn from "parse-torrent-name";
import { join } from "path";
import mv from "mv";
import readdirp from "readdirp";
import SaveButton from "../../../components/SaveButton";

class SeriesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: 0,
      files: [],
      completed: 0,
      destinationFolder: "",
      checkedExtensions: []
    };
  }

  changeDestinationFolder = () => {
    let path = remote.dialog.showOpenDialog({
      properties: ["openDirectory"]
    });
    if (path) {
      path = path[0];

      this.setState({ destinationFolder: path });
    }
  };

  handleChangeCheckbox = (name, event) => {
    const checkedExtensions = event.target.checked
      ? [...this.state.checkedExtensions, name]
      : this.state.checkedExtensions.filter(item => item !== name);

    this.setState({
      checkedExtensions
    });
  };

  openDialog() {
    const paths = remote.dialog.showOpenDialog({
      properties: ["openFile", "openDirectory", "multiSelections"]
    });
    this.handleOpenFiles(paths);
  }

  async handleOpenFiles(paths) {
    const { recursive } = this.state;
    const files = [];
    if (paths && paths.length > 0) {
      for (let path of paths) {
        const info = fs.statSync(path);
        if (info.isDirectory()) {
          const options = {};
          if (!recursive) {
            options.depth = 0;
          }
          const entries = await readdirp.promise(path, options);
          files.push(...entries.map(item => item.fullPath));
        } else {
          files.push(path);
        }
      }
    }
    this.formatData(files);
  }

  formatData(data) {
    const { destinationFolder } = this.state;
    const files = [...data].map(item => {
      const name = item.split("/").pop();
      const extension = name.split(".").pop();
      const outputPath = `${destinationFolder}/${extension}/${name}`;

      return { name, outputName: name, outputPath, path: item, extension };
    });
    this.setState({
      files,
      checkedExtensions: [...new Set(files.map(item => item.extension))]
    });
  }

  onRemoveElement(serie) {
    this.setState({
      files: this.state.files.filter(item => item.path !== serie.path)
    });
  }

  moveFiles(data) {
    data.forEach(file => {
      mv(
        file.path,
        file.outputPath,
        {
          mkdirp: true
        },
        function(err) {
          if (err) throw err;
        }
      );
    });
    this.setState({
      files: []
    });
  }

  render() {
    const {
      destinationFolder,
      recursive,
      files,
      checkedExtensions
    } = this.state;
    const extensions = [...new Set(files.map(item => item.extension))];
    let data = files.filter(item => checkedExtensions.includes(item.extension));
    if (!data) {
      data = [];
    }

    return (
      <div className="containerScreen">
        <div style={{ maxHeight: "60vh", overflowY: "scroll" }}>
          <div className="row">
            <div className="rowItem">
              <Button
                className="submitButton"
                onClick={() => this.changeDestinationFolder()}
              >
                Destination Folder
              </Button>
              <p>{destinationFolder}</p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <Switch
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
          </div>
          {extensions &&
            extensions.length > 0 &&
            extensions.map(item => (
              <FormControlLabel
                label={item}
                control={
                  <Checkbox
                    checked={checkedExtensions.includes(item)}
                    onChange={event => this.handleChangeCheckbox(item, event)}
                    value={item}
                    inputProps={{
                      "aria-label": "primary checkbox"
                    }}
                  />
                }
              />
            ))}
          {data && data.length > 0 ? (
            <SerieList
              series={data}
              onRemoveElement={serie => this.onRemoveElement(serie)}
            />
          ) : (
            <div
              onClick={() => this.openDialog()}
              onDrop={e => {
                e.preventDefault();
                e.stopPropagation();
                this.handleOpenFiles(Object.values(e.dataTransfer.files));
              }}
              onDragOver={e => {
                e.stopPropagation();
                e.preventDefault();
              }}
              style={{
                width: "100%",
                height: "20vh",
                border: "5px solid red",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <p>drag n drop file or folders mate</p>
            </div>
          )}
        </div>

        <Button
          onClick={() =>
            this.setState({
              files: []
            })
          }
        >
          Cancel
        </Button>
        <Button onClick={() => this.moveFiles(data)}>Confirm</Button>
        <SaveButton
          data={{
            ...this.state,
            type: "Extension",
            action: "Rename",
            active: false
          }}
        />
      </div>
    );
  }
}

export default SeriesPage;
