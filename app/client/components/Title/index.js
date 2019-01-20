import React from "react";
import "./style.css";

const Title = ({ title, style }) => {
	return (
		<h1 className="title" style={style}>
			{title}
		</h1>
	);
};

export default Title;
