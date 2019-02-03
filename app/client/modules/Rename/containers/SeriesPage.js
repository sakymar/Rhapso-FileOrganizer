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
import fs from "fs";
import fileEntryCache from "file-entry-cache";
import LinearProgress from "@material-ui/core/LinearProgress";
import { ipcRenderer } from "electron";
import Title from "../../../components/Title";
import SerieList from "../components/SerieList";
import SelectFormat from "../../../components/SelectFormat";

import Select from "@material-ui/core/Select";
import { Button as MButton, Icon as MIcon } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

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

		const dateOptions = [
			{
				value: 0,
				label: "Decade"
			},
			{
				value: 1,
				label: "Year"
			},
			{
				value: 2,
				label: "Month"
			},
			{
				value: 3,
				label: "Week"
			},
			{
				value: 4,
				label: "Day"
			},
			{
				value: 5,
				label: "Hour"
			}
		];
		return (
			<div className="containerScreen">
				<Title title="Move / Rename" />
				<SelectFormat
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
				/>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyConten: "center",
						alignItems: "center",
						marginTop: 50
					}}
				>
					<div style={{ display: "flex", justifyContent: "center" }}>
						<Button onClick={this.changeDestinationFolder}>
							Destination Folder
						</Button>
						{this.state.formatDate.map((format, index) => (
							<div>
								<SelectFormat
									value={this.state.formatDate[index]}
									onChange={value =>
										handleChangeFormatDate(value, index)
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
										this.state.formatDate[index - 1],
										dateOptions.length + 1
									)}
								/>
								<MButton
									variant="fab"
									color="secondary"
									style={{
										width: 30,
										height: 30,
										minHeight: 30,
										minWidth: 30
									}}
									onClick={() =>
										this.handleRemoveFormatDate(index)
									}
								>
									<CloseIcon />
								</MButton>
								/
							</div>
						))}
						<MButton
							onClick={() =>
								this.setState({
									formatDate: [
										...this.state.formatDate,
										typeof this.state.formatDate[
											this.state.formatDate.length - 1
										] != "undefined"
											? this.state.formatDate[
													this.state.formatDate
														.length - 1
											  ] + 1
											: 0
									]
								})
							}
							style={{
								width: 30,
								height: 30,
								minHeight: 30,
								minWidth: 30
							}}
							variant="fab"
							color="secondary"
							aria-label="Edit"
						>
							<AddIcon />
						</MButton>
					</div>
					<div
						style={{
							marginTop: 20,
							marginBottom: 20,
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							fontSize: 12
						}}
					>
						<p>
							Example : folder/file -->{" "}
							{this.state.destinationFolder}{" "}
						</p>
						{this.state.formatDate.map(part => (
							<p style={{ fontSize: 12 }}>
								{dateOptions[part].label}/
							</p>
						))}
					</div>
				</div>
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

// function mapDispatchToProps(dispatch) {
// 	return bindActionCreators(actions, dispatch);
// }

export default connect(
	mapStateToProps,
	actions
)(SeriesPage);
