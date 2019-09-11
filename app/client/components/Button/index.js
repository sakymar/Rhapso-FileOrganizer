import React, { Component } from "react";
import styled from "styled-components";

const ButtonContainer = styled.div`
  padding: 15px;
  color: white;
  background-color: black;

  ${props => props.styles};
`;

const Button = ({ children, onClick, styles, label }) => (
  <ButtonContainer onClick={() => onClick()} styles={styles}>
    {children}
  </ButtonContainer>
);

export default Button;
