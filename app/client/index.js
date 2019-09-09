import React from "react";
import { render } from "react-dom";

import { hot, AppContainer } from "react-hot-loader";
import Root from "./Root";
import store from "./store/configureStore";
import "./app.global.css";

render(<Root store={store} />, document.getElementById("root"));

// if (module.hot) {
//   module.hot.accept("./Root", () => {
//     // eslint-disable-next-line global-require
//     const NextRoot = require("./Root").default;
//     render(
//       <AppContainer>
//         <NextRoot store={store} />
//       </AppContainer>,
//       document.getElementById("root")
//     );
//   });
// }
