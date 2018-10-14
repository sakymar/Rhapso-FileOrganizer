/* eslint flowtype-errors/show-errors: 0 */
import React from "react";
import { Switch, Route } from "react-router";
import App from "./App";
import Sidebar from "./components/Sidebar";
import SeriesPage from "./modules/Rename/containers/SeriesPage";

export default () => (
	<App>
		<Switch>
			<Route path="/series" component={SeriesPage} />
			<Route path="/" component={Sidebar} />
		</Switch>
	</App>
);
