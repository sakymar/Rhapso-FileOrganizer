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

export default class Sidebar extends Component {
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
        <Link to={"/create"}>
          <Menu.Item name="television">
            <Icon.Group size="big">
              <Icon name="file outline" />
              <Icon corner="top right" inverted name="add" />
            </Icon.Group>
            <p style={{ fontSize: 15 }}>Create</p>
          </Menu.Item>
        </Link>
        <Link to={"/series"}>
          <Menu.Item name="film">
            <Icon name="copy outline" />
            Move & Rename
          </Menu.Item>
        </Link>
        <Link to={"/delete"}>
          <Menu.Item name="television">
            <Icon.Group size="big">
              <Icon name="file outline" />
              <Icon corner="top right" inverted name="delete" />
            </Icon.Group>
            <p style={{ fontSize: 15 }}>Delete</p>
          </Menu.Item>
        </Link>

        <Link to={"/delete"}>
          <Menu.Item name="chart bar outline">
            <Icon name="chart bar outline" />
            <p style={{ fontSize: 15 }}>Stats</p>
          </Menu.Item>
        </Link>
        <Link to={"/delete"}>
          <Menu.Item name="settings">
            <Icon name="settings" />
            <p style={{ fontSize: 15 }}>Settings</p>
          </Menu.Item>
        </Link>
      </SidebarSemantic>
    );
  }
}
