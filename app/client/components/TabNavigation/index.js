import React from "react";
import { Tabs, Tab } from "@material-ui/core/";
import styled from "styled-components";

const TabNavigationContainer = styled.div`
  .tab {
    border-bottom: 1px solid white;
    letter-spacing: 0.5px;
    text-transform: capitalize;
    font-family: OpenSans;
    font-weight: bold;
  }

  .tabActive {
    border-bottom: 1px solid #f76d3a;
  }
`;

const TabNavigation = ({ labels, onChange, value }) => {
  console.log(value);
  return (
    <TabNavigationContainer>
      <Tabs
        style={{ backgroundColor: "transparent" }}
        value={value}
        onChange={(event, value) => onChange(value)}
        indicatorColor="orange"
        textColor="primary"
        variant="fullWidth"
      >
        {labels.map((label, index) => {
          console.log(index, value, index === value);

          return (
            <Tab
              style={{ color: "white" }}
              className={index === value ? "tab tabActive" : "tab"}
              currentValue={value}
              index={index}
              label={label}
            />
          );
        })}
      </Tabs>
    </TabNavigationContainer>
  );
};

export default TabNavigation;
