import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../actions/series";
import { Button, Icon } from "semantic-ui-react";
import { remote } from "electron";
import Title from "../../../components/Title";
import SerieList from "../components/SerieList";
import TabNavigation from "../../../components/TabNavigation";
import AppBar from "@material-ui/core/AppBar";
import ByDate from "./ByDate";
import ByExtension from "./ByExtension";
import fs from "fs";
import moment from "moment";

import { renameFiles } from "../actions";

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
      formatDate: [0],
      videos: [],
      completed: 0,
      loading: false,
      destinationFolder: "",
      tabIndex: 0
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

  formatOutputPathExtension(path, name) {
    const extension = name.split(".").pop();
    return `${path.replace(name, "")}${extension}/${name}`;
  }

  handleOpenFiles() {
    const paths = remote.dialog.showOpenDialog({
      properties: ["openFile", "multiSelections"]
    });
    const { formatDate } = this.state;
    if (paths && paths.length > 0) {
      const series = paths.map(item => {
        const infos = fs.statSync(item);
        console.log("INFOS", infos);
        const path = item;

        const name = item.split("/").pop();
        let outputPath = path.replace(name, "");
        formatDate.forEach(date => {
          outputPath = `${outputPath}${VALUE_TO_MOMENT[date](infos.mtime)}/`;
        });

        outputPath = `${outputPath}${name}`;
        return {
          path,
          name,
          outputName: name,
          outputPath
        };
      });
      this.setState({ series });
    }
    console.log(paths);
  }

  onRemoveElement(serie) {
    this.setState({
      series: this.state.series.filter(item => item.path !== serie.path)
    });
  }

  render() {
    const { format, loading, completed, tabIndex } = this.state;
    return (
      <div className="containerScreen">
        <Title title="Move / Rename" />
        <AppBar
          style={{ backgroundColor: "transparent" }}
          position="static"
          color="default"
        >
          <TabNavigation
            labels={["By Extension", "By Date", "By Serie Format"]}
            onChange={tabIndex => this.setState({ tabIndex })}
            value={tabIndex}
          />
        </AppBar>
        {this.state.tabIndex === 0 && (
          <ByExtension
            recursive={this.state.recursive}
            onChangeRecursive={() =>
              this.setState({
                recursive: !this.state.recursive
              })
            }
            changeDestinationFolder={this.changeDestinationFolder}
            sourceFolder={this.state.destinationFolder}
          />
        )}
        {this.state.tabIndex === 1 && (
          <ByDate
            formatDate={this.state.formatDate}
            changeDestinationFolder={field =>
              this.changeDestinationFolder(field)
            }
            sourceFolder={this.state.sourceFolder}
            destinationFolder={this.state.destinationFolder}
            handleChangeFormatDate={(value, index) =>
              this.handleChangeFormatDate(value, index)
            }
            handleRemoveFormatDate={index => this.handleRemoveFormatDate(index)}
            handleAddFormatDate={value => this.setState({ formatDate: value })}
          />
        )}
        <div style={{ maxHeight: "60vh", overflowY: "scroll" }}>
          {this.state.series && this.state.series.length > 0 ? (
            <SerieList
              series={this.state.series}
              onRemoveElement={serie => this.onRemoveElement(serie)}
              onDrop={this.onDrop}
            />
          ) : (
            <div
              onClick={() => this.handleOpenFiles()}
              onDrop={e => {
                e.preventDefault();
                e.stopPropagation();
                this.setState({
                  series: Object.values(e.dataTransfer.files).map(item => ({
                    ...item,
                    name: item.name,
                    path: item.path,
                    outputName: item.name,
                    outputPath: this.formatOutputPathExtension(
                      item.path,
                      item.name
                    )
                  }))
                });
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
              <p>drag n drop baby</p>
            </div>
          )}
        </div>
        <div
          style={{
            marginLeft: "15%",
            marginRight: "15%",
            margin: "auto"
          }}
        >
          {/* {loading ? (
            <LinearProgress
              style={{ width: "15px" }}
              variant="determinate"
              value={this.state.completed}
            />
          ) : (
            ""
          )} */}
        </div>

        <div style={{ marginTop: "50px" }}>
          <Button
            style={{
              marginLeft: "10%",
              backgroundColor: "#AB2421",
              color: "white"
            }}
            icon
            labelPosition="right"
            onClick={this.props.removeAllSeries}
          >
            Cancel
            <Icon name="cancel" />
          </Button>
          <Button
            style={{
              marginLeft: "60%",
              backgroundColor: "#45F556",
              color: "white"
            }}
            icon
            labelPosition="right"
            onClick={() => renameFiles(this.state.series)}
          >
            Confirm
            <Icon name="right arrow" />
          </Button>
        </div>
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
