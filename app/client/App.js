import * as React from "react";
import Sidebar from "./components/Sidebar";
import AppBar from "./components/AppBar";

export default class App extends React.Component {
	render() {
		return (
			<div>
				<AppBar name="Rhapso-FileOrganizer" />
				<Sidebar />
				{this.props.children}
			</div>
		);
	}
}
