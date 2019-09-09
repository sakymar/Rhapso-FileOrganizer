import React, { Component } from "react";
import styled from "styled-components";

const ButtonContainer = styled.div`
  padding: 15px;
  color: white;
  background-color: black;

  ${props => props.styles};
`;

const Button = ({ label }) => (
  <ButtonContainer styles={styles}>
    <p>{label}</p>
  </ButtonContainer>
);

export default Button;
