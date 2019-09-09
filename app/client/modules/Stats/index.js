import React, { Component } from "react";
import styled from "styled-components";

const StatsContainer = styled.div``;

class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <StatsContainer className="containerScreen">
        <h1>Stats page</h1>
      </StatsContainer>
    );
  }
}

export default Stats;
