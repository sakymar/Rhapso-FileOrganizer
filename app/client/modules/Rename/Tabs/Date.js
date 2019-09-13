import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../actions/series";
import { remote } from "electron";
import SerieList from "../components/SerieList";
import fs from "fs";
import Button from "../../../components/Button";

import { Switch } from "@material-ui/core";
import mv from "mv";
import readdirp from "readdirp";
import SelectFormat from "../../../components/SelectFormat";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";
import moment from "moment";

const ByDateContainer = styled.div`
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
    width: 80%;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
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

  .resultFormat {
    margin-top: 10px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .resultFormat p {
    margin: 0 !important;
    font-size: 12px;
  }
`;

const dateOptions = [
  {
    value: 0,
    label: "Year"
  },
  {
    value: 1,
    label: "Month"
  },
  {
    value: 2,
    label: "Week"
  },
  {
    value: 3,
    label: "Day"
  },
  {
    value: 4,
    label: "Hour"
  }
];

const VALUE_TO_MOMENT = {
  0: date => moment(date).format("YYYY"),
  1: date => moment(date).format("MMMM"),
  2: date => `Week - ${moment(date).format("w")}`,
  3: date => `Day - ${moment(date).format("D")}`,
  4: date => `${moment(date).format("D")}h`
};

class SeriesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: 0,
      formatDate: [],
      destinationFolder: ""
    };
  }

  handleRemoveFormatDate = index => {
    let { formatDate } = this.state;
    formatDate.splice(index, 1);
    this.setState({ formatDate });
  };

  handleChangeFormatDate = (value, indexValue) => {
    let { formatDate } = this.state;
    let newFormatDate = [];
    formatDate.forEach((date, index) => {
      if (index === indexValue) {
        newFormatDate.push(value);
      } else if (date < newFormatDate[index - 1]) {
        newFormatDate.push(newFormatDate[index - 1] + 1);
      } else {
        newFormatDate.push(date);
      }
    });
    this.setState({ formatDate: newFormatDate });
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

  openDialog() {
    const paths = remote.dialog.showOpenDialog({
      properties: ["openFile", "openDirectory", "multiSelections"]
    });
    console.log("PATH ON CLICK", paths);
    this.handleOpenFiles(paths);
  }

  async handleOpenFiles(paths) {
    const { recursive } = this.state;
    console.log("PATHS HANDLE OPEN", paths);
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
    const { formatDate } = this.state;
    const series = [...data].map(item => {
      const name = item.split("/").pop();
      let outputPath = "";
      const info = fs.statSync(item);
      formatDate.forEach(date => {
        outputPath = `${outputPath}/${VALUE_TO_MOMENT[date](info.mtime)}`;
      });
      outputPath = `${outputPath}/${name}`;
      return {
        name,
        path: item,
        outputName: name,
        outputPath
      };
      // ...item,
      // name: item.name,
      // path: item.path,
      // outputName: item.name,
      // outputPath: this.formatOutputPath(item.path, item.name)
    });
    this.setState({ series });
    console.log(series);
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
    const { destinationFolder, formatDate, recursive } = this.state;
    return (
      <div className="containerScreen">
        <div style={{ maxHeight: "60vh", overflowY: "scroll" }}>
          <ByDateContainer>
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
            <div className="row">
              <p>Format : </p>
              {formatDate.map((format, index) => (
                <div>
                  <SelectFormat
                    value={formatDate[index]}
                    onChange={value =>
                      this.handleChangeFormatDate(value, index)
                    }
                    style={{
                      color: "white",
                      minWidth: 150,
                      borderBottom: "1px solid white",
                      marginLeft: 30,
                      fontSize: 16
                    }}
                    classes={{ icon: { color: "white" } }}
                    options={dateOptions.slice(
                      formatDate[index - 1],
                      dateOptions.length + 1
                    )}
                  />
                  <Button
                    variant="fab"
                    color="secondary"
                    style={{
                      width: 25,
                      height: 25,
                      minHeight: 25,
                      minWidth: 25
                    }}
                    onClick={() => this.handleRemoveFormatDate(index)}
                  >
                    <CloseIcon />
                  </Button>
                  /
                </div>
              ))}

              <Button
                onClick={() =>
                  this.setState({
                    formatDate: [
                      ...formatDate,
                      typeof formatDate[formatDate.length - 1] != "undefined"
                        ? formatDate[formatDate.length - 1] + 1
                        : 0
                    ]
                  })
                }
                style={{
                  width: 25,
                  height: 25,
                  minHeight: 25,
                  minWidth: 25
                }}
                variant="fab"
                color="secondary"
                aria-label="Edit"
              >
                <AddIcon />
              </Button>
            </div>

            <div className="resultFormat">
              <p>Example : folder/file --> {destinationFolder} </p>
              {formatDate.map(part => (
                <p style={{ fontSize: 12 }}>{dateOptions[part].label}/</p>
              ))}
            </div>
          </ByDateContainer>
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
                console.log("DRAG START", e.dataTransfer.files);
              }}
              onDragOver={e => {
                e.stopPropagation();
                e.preventDefault();
                console.log("DRAGOVER", e);
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
