/* eslint flowtype-errors/show-errors: 0 */
import React from "react";
import { Switch, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Rename from "./modules/Rename";
import Delete from "./modules/Delete";
import Create from "./modules/Create";
import AppBar from "./components/AppBar";
import styled from "styled-components";

//MODULES
import Settings from "./modules/Settings";
import Stats from "./modules/Stats";
import Rules from "./modules/Rules";

const Layout = styled.div`
  .content {
    display: flex;
    flex-direction: row;
    height: 100vh;
  }
`;

export default () => (
  <Layout>
    <AppBar name="Rhapso-FileOrganizer" />
    <div className="content">
      <Sidebar />
      <Switch>
        <Route path="/settings" component={Settings} />
        <Route path="/stats" component={Stats} />
        <Route path="/rename" component={Rename} />
        <Route path="/create" component={Create} />
        <Route path="/delete" component={Delete} />
        <Route path="/rules" component={Rules} />
        <Route path="/" component={Rename} />
      </Switch>
    </div>
  </Layout>
);
