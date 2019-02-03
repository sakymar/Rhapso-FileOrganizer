/* eslint flowtype-errors/show-errors: 0 */
import React from "react";
import { Switch, Route } from "react-router";
import Sidebar from "./components/Sidebar";
import SeriesPage from "./modules/Rename/containers/SeriesPage";
import Delete from "./modules/Delete";
import Create from "./modules/Create";
import AppBar from "./components/AppBar";

export default () => (
  <div>
    <AppBar name="Rhapso-FileOrganizer" />
    <Sidebar />
    <Switch>
      <Route path="/series" component={SeriesPage} />
      <Route path="/create" component={Create} />
      <Route path="/delete" component={Delete} />
      <Route path="/" component={SeriesPage} />
    </Switch>
  </div>
);
