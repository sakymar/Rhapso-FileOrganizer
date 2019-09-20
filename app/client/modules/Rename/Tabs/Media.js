import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../actions/series";
import { remote } from "electron";
import SerieList from "../components/SerieList";
import fs from "fs";
import Button from "../../../components/Button";

import { renameFiles } from "../actions";
import { Switch } from "@material-ui/core";
import ptn from "parse-torrent-name";
import { join } from "path";
import mv from "mv";
import readdirp from "readdirp";

class SeriesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: 0,
      videos: [],
      completed: 0,
      destinationFolder: ""
    };
  }

  removeSerie(serie) {
    this.props.removeSerie(serie);
    this.setState({ videos: this.props.series });
  }

  convertSeries = () => {
    this.setState({ loading: true });
    this.props.convertSeries(this.props.series);
  };

  changeDestinationFolder = () => {
    let path = remote.dialog.showOpenDialog({
      properties: ["openDirectory"]
    });
    if (path) {
      path = path[0];

      this.setState({ destinationFolder: path });
    }
  };

  formatOutputPath(path, name) {
    const extension = name.split(".").pop();
    return `${path.replace(name, "")}${extension}/${name}`;
  }

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
          files.push(...entries.map(item.fullPath));
        } else {
          files.push(path);
        }
      }
    }
    this.formatData(files);
  }

  formatData(data) {
    const { destinationFolder } = this.state;
    const series = [...data].map(item => {
      const name = item.split("/").pop();
      try {
        const extension = name.split(".").pop();
        const nameWithoutExtension = name.replace(`.${extension}`, "");
        const infos = ptn(nameWithoutExtension);
        if (infos && infos.season) {
          const outputName = `${infos.title} - Episode ${infos.episode}.${extension}`;
          const outputPath = join(
            destinationFolder,
            `${infos.title}/Season - ${infos.season}/${outputName}`
          );
          return { name, outputName, outputPath, path: item };
        } else if (infos) {
          const outputName = `${infos.title}.${extension}`;
          const outputPath = join(destinationFolder, `${outputName}`);
          return { name, outputName, outputPath, path: item };
        }

      } catch (e) {
        console.log(e);
      }

      // ...item,
      // name: item.name,
      // path: item.path,
      // outputName: item.name,
      // outputPath: this.formatOutputPath(item.path, item.name)
    });
    this.setState({ series });
  }

  onRemoveElement(serie) {
    this.setState({
      series: this.state.series.filter(item => item.path !== serie.path)
    });
  }

  moveFiles() {
    const { series } = this.state;
    series.forEach(file => {
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
      series: []
    });
  }

  render() {
    const { destinationFolder, recursive } = this.state;
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
          {this.state.series && this.state.series.length > 0 ? (
            <SerieList
              series={this.state.series}
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
              series: []
            })
          }
        >
          Cancel
        </Button>
        <Button onClick={() => this.moveFiles()}>Confirm</Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { series, progress } = state;
  return {
    series,
    progress
  };
}

export default connect(
  mapStateToProps,
  actions
)(SeriesPage);
