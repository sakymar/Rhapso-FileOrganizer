import * as React from "react";
import Sidebar from "./components/Sidebar";

export default class App extends React.Component {
	render() {
		return (
			<div>
				<Sidebar />
				{this.props.children}
			</div>
		);
	}
}
