import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../actions/series";
import Dropzone from "react-dropzone";
import { Button, Icon } from "semantic-ui-react";
import { remote } from "electron";
import LinearProgress from "@material-ui/core/LinearProgress";
import Title from "../../../components/Title";
import SerieList from "../components/SerieList";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ByDate from "./ByDate";
import ByExtension from "./ByExtension";

class SeriesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      format: 0,
      formatDate: [0],
      videos: [],
      completed: 0,
      loading: false,
      destinationFolder: ""
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
        <h2 className="drop-message">
          Drag and drop some files on me, or click to select.
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

    console.log("ONDROP", files, videos);
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

  changeDestinationFolder = () => {
    let path = remote.dialog.showOpenDialog({
      properties: ["openDirectory"]
    });
    if (path) {
      path = path[0];
      this.setState({ destinationFolder: path });
    }
  };

  handleRemoveFormatDate = index => {
    let { formatDate } = this.state;
    formatDate.splice(index, 1);
    this.setState({ formatDate });
  };

  render() {
    const { format, loading, completed } = this.state;

    const options = [
      {
        value: 0,
        label: "By Date"
      },
      {
        value: 2,
        label: "By Extension"
      },
      {
        value: 3,
        label: "By Serie Format"
      }
    ];

    return (
      <div className="containerScreen">
        <Title title="Move / Rename" />
        <AppBar
          style={{ backgroundColor: "transparent" }}
          position="static"
          color="default"
        >
          <Tabs
            style={{ backgroundColor: "transparent" }}
            value={this.state.tabIndex}
            onChange={(event, value) => this.setState({ tabIndex: value })}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab style={{ color: "white" }} label="By Extension" />
            <Tab style={{ color: "white" }} label="By Date" />
            <Tab style={{ color: "white" }} label="By Serie Format" />
          </Tabs>
        </AppBar>
        {/* <SelectFormat
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
        /> */}
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
            destinationFolder={this.state.destinationFolder}
            handleChangeFormatDate={this.handleChangeFormatDate}
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
          {loading ? (
            <LinearProgress
              style={{ width: "15px" }}
              variant="determinate"
              value={this.state.completed}
            />
          ) : (
            ""
          )}
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
            onClick={this.convertSeries}
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
