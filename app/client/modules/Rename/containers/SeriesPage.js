import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../actions/series";
import Dropzone from "react-dropzone";
import { Button, Icon } from "semantic-ui-react";
import { remote } from "electron";
import LinearProgress from "@material-ui/core/LinearProgress";
import Title from "../../../components/Title";
import SerieList from "../components/SerieList";

import TabNavigation from "../../../components/TabNavigation";
import AppBar from "@material-ui/core/AppBar";
import ByDate from "./ByDate";
import ByExtension from "./ByExtension";

import { renameByDate } from "../actions";

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

  componentDidMount() {
    this.setState({
      completed: this.props.progress * 100,
      loading: this.props.progress * 100 === 100
    });
  }

  renderChildren({ isDragActive, isDragReject }) {
    if (isDragActive) {
      return (
        <h2 className="drop-message">Omnomnom, let me have those videos!</h2>
      );
    } else if (isDragReject) {
      return (
        <h2 className="drop-message">
          Uh oh, I don't know how to deal with that type of file!
        </h2>
      );
    } else {
      return (
        <h2
          className="drop-message"
          style={{ textAlign: "center", fontSize: 22 }}
        >
          Or directly Drag and drop or select files here
        </h2>
      );
    }
  }

  onDrop = async files => {
    // invalid file types are not added to files object
    //console.log("PASSAGE");
    const videos = await _.map(files, ({ name, path, size, type }) => {
      return { name, path, size, type };
    });
    if (videos.length) {
      this.setState({ videos });
      this.props.addSeries({
        series: videos,
        destinationFolder: this.state.destinationFolder
      });
    }
  };

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
    console.log("FORMAT DATE ENTER", formatDate);
    formatDate.forEach((date, index) => {
      if (index === indexValue) {
        newFormatDate.push(value);
      } else if (date < newFormatDate[index - 1]) {
        newFormatDate.push(newFormatDate[index - 1] + 1);
      } else {
        newFormatDate.push(date);
      }
    });
    console.log("FORMAT DATE RESULT", newFormatDate);
    this.setState({ formatDate: newFormatDate });
  };

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
          {this.props.series.length > 0 ? (
            <SerieList
              series={this.props.series}
              onRemoveElement={serie => this.removeSerie(serie)}
              onDrop={this.onDrop}
            />
          ) : (
            <Dropzone
              onDrop={this.onDrop}
              multiple
              className="dropzone"
              activeClassName="dropzone-active"
              rejectClassName="dropzone-reject"
            >
              {this.renderChildren}
            </Dropzone>
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
            onClick={() => renameByDate(this.state)}
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
