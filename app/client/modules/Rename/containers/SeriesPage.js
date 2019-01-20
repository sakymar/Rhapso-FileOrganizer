import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../../actions/series";
import Dropzone from "react-dropzone";
import styles from "../styles/SeriesPage.css";
import { Button, Icon } from "semantic-ui-react";
import electron, { remote, dialog } from "electron";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import fs from "fs";
import fileEntryCache from "file-entry-cache";
import LinearProgress from "@material-ui/core/LinearProgress";
import { ipcRenderer } from "electron";
import Title from "../../../components/Title";
import SerieList from "../components/SerieList";
import SelectFormat from "../../../components/SelectFormat";

class SeriesPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			format: 0,
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
				<h2 className="drop-message">
					Omnomnom, let me have those videos!
				</h2>
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
			console.log("directory", path);
			this.setState({ destinationFolder: path });
		}
		const files = fs.readdirSync(path);
		console.log(files);
	};

	render() {
		//console.log("props", this.props);
		//console.log("state", this.state);
		const { format, loading, completed } = this.state;

		const options = [
			{
				value: 0,
				label: "By Date"
			},
			{
				value: 1,
				label: "By Size"
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
				<Title title="Rename" />
				<SelectFormat
					value={format}
					onChange={value => this.setState({ format: value })}
					options={options}
					style={{ color: "white", minWidth: "300px" }}
					classes={{ icon: { color: "white" } }}
				/>
				<div style={{ display: "flex", justifyContent: "center" }}>
					<Button onClick={this.changeDestinationFolder}>
						Destination Folder
					</Button>
					<Button onClick={this.changeDestinationFolder}>
						Format
					</Button>
				</div>
				<div>Example : folder/file --> folder/year/month/file</div>
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
						style={{ marginLeft: "10%" }}
						icon
						color="red"
						labelPosition="right"
						onClick={this.props.removeAllSeries}
					>
						Cancel
						<Icon name="cancel" />
					</Button>
					<Button
						style={{ marginLeft: "60%" }}
						icon
						color="green"
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

// function mapDispatchToProps(dispatch) {
// 	return bindActionCreators(actions, dispatch);
// }

export default connect(
	mapStateToProps,
	actions
)(SeriesPage);
