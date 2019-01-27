// @flow
import React, { Component } from "react";
import {
	Sidebar as SidebarSemantic,
	Segment,
	Button,
	Menu,
	Image,
	Icon,
	Header
} from "semantic-ui-react";
import { Link } from "react-router-dom";

type Props = {};

export default class Sidebar extends Component<Props> {
	props: Props;

	render() {
		return (
			<SidebarSemantic
				as={Menu}
				className="customSidebar"
				animation="overlay"
				width="thin"
				visible={true}
				icon="labeled"
				vertical
				inverted
				style={{
					width: "8%",
					overflow: "hidden",
					backgroundColor: "#7E2991"
				}}
			>
				<Link to={"/series"}>
					<Menu.Item name="television">
						<Icon name="television" />
						Rename
					</Menu.Item>
				</Link>

				<Menu.Item name="film">
					<Icon name="film" />
					Delete
				</Menu.Item>
				<Menu.Item name="bar graph">
					<Icon name="bar chart" />
					Create
				</Menu.Item>
				<Menu.Item name="bar graph">
					<Icon name="bar chart" />
					Stats
				</Menu.Item>
			</SidebarSemantic>
		);
	}
}
