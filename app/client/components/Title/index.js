import React from "react";
import styled from "styled-components";

const TitleContainer = styled.h1`
	font-size: 30px;
	font-family: Raleway !important;
	font-weight: 200;
`;

const Title = ({ title, style }) => (
	<TitleContainer className="title" style={style}>
		{title}
	</TitleContainer>
);

export default Title;
