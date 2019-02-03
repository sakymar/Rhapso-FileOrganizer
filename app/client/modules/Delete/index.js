import React, { Component } from "react";
import Title from "../../components/Title";
import SelectFormat from "../../components/SelectFormat";

export default class Delete extends Component {
	constructor(props) {
		super(props);
		this.state = {
			format: 0
		};
	}

	render() {
		const { format } = this.state;
		const options = [{ value: 0, label: "Delete" }];
		return (
			<div className="containerScreen">
				<Title title="Delete" />
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
			</div>
		);
	}
}
