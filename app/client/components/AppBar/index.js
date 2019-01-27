import React from "react";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";

const AppBarContainer = styled.div`
	width: 100%;
	height: 30px;
	background-color: #070717;
	color: white;
	z-index: 10;
	display: flex;
	flex-direction: row;
	align-items: center;

	p {
		margin: 0 !important;
	}

	.titleAppBar {
		margin-left: 30px !important;
		font-size: 14px;
		font-family: Raleway;
		letter-spacing: 2px;
	}

	.rightAppBar {
		margin-left: auto;
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 5%;
		justify-content: space-between;
		margin-right: 10px;
	}
`;

const remote = require("electron").remote;

// document.getElementById("min-btn").addEventListener("click", function (e) {
//      var window = remote.getCurrentWindow();
//      window.minimize();
// });

// document.getElementById("max-btn").addEventListener("click", function (e) {
//      var window = remote.getCurrentWindow();
//      if (!window.isMaximized()) {
//          window.maximize();
//      } else {
//          window.unmaximize();
//      }
// });

// document.getElementById("close-btn").addEventListener("click", function (e) {
//      var window = remote.getCurrentWindow();
//      window.close();
// });

const AppBar = ({ name }) => {
	const window = remote.getCurrentWindow();
	return (
		<AppBarContainer className="titleBar">
			<p className="titleAppBar">{name}</p>
			<div className="rightAppBar">
				<Icon
					name="window minimize"
					className="noDrag"
					onClick={() => window.minimize()}
				/>
				<Icon
					className="noDrag"
					name="close"
					onClick={() => window.close()}
				/>
			</div>
		</AppBarContainer>
	);
};

export default AppBar;
