import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../actions/series";
import Dropzone from "react-dropzone";
import styles from "./SeriesPage.css";
import { Button, Icon } from "semantic-ui-react";
import electron, { remote, dialog } from "electron";
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import fs from "fs";
import fileEntryCache from "file-entry-cache";
import LinearProgress from "@material-ui/core/LinearProgress";
import { ipcRenderer } from "electron";

class SeriesPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
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

	renderList() {
		let series = this.props.series;
		if (series && series.length > 0) {
			return (
				<div style={{ display: "flex" }}>
					<List
						style={{
							backgroundColor: "white",
							width: "45%",
							marginLeft: "5%",
							borderRadius: "2px",
							paddingBottom: "0px",
							marginBottom: "0px"
						}}
					>
						{series.map(serie => {
							if (!serie.renamed) {
								return (
									<ListItem
										key={serie.id}
										style={{
											borderBottom: "1px solid black"
										}}
									>
										<ListItemText
											primary={serie.name}
											secondary={serie.path}
										/>
										<ListItemSecondaryAction>
											<IconButton
												onClick={() =>
													this.removeSerie(serie)
												}
												aria-label="Delete"
											>
												<DeleteIcon />
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
								);
							}
						})}
						<ListItem
							className={styles.dropListItem}
							style={{ padding: 0 }}
						>
							<Dropzone
								onDrop={this.onDrop}
								multiple
								activeStyle={{
									backgroundColor: "red",
									border: "5px solid red"
								}}
								rejectClassName="dropzone-reject"
								style={{
									width: "100%",
									height: "100px",
									display: "flex",
									justifyContent: "center",
									alignItems: "center"
								}}
							>
								<AddIcon style={{ color: "red" }} />
							</Dropzone>
						</ListItem>
					</List>
					<List
						style={{
							backgroundColor: "white",
							width: "40%",
							marginLeft: "5%",
							borderRadius: "2px"
						}}
					>
						{series.map(serie => {
							return (
								<ListItem
									key={serie.id}
									style={{
										borderBottom: "1px solid black",
										backgroundColor: serie.renamed
											? "green"
											: "white"
									}}
								>
									<ListItemText
										primary={serie.outputName}
										secondary={serie.outputPath}
									/>
								</ListItem>
							);
						})}
					</List>
				</div>
			);
		}
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
			console.log(path);
			this.setState({ destinationFolder: path });
		}
	};

	render() {
		//console.log("props", this.props);
		//console.log("state", this.state);
		let seriesList = this.renderList();
		const { loading, completed } = this.state;
		return (
			<div style={{ marginLeft: "10%" }}>
				<h1 style={{ marginLeft: "25%", marginTop: "5%" }}>
					{" "}
					Organize TV Series
				</h1>
				<h3 style={{ textAlign: "center" }}> Format</h3>
				<div style={{ display: "flex", justifyContent: "center" }}>
					<Button onClick={this.changeDestinationFolder}>
						Destination Folder
					</Button>
				</div>
				{this.props.series.length > 0 ? (
					this.renderList()
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

export default connect(mapStateToProps, actions)(SeriesPage);
