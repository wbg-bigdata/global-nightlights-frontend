// Modules
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

// App
import App from "./App";

// Components
import DataExplorer from "./components/data-explorer/";

// Libraries
import configureStore from "./store";
import registerServiceWorker from "./registerServiceWorker";

// Styles
import "./index.css";

// Store
const { store } = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App>
        <Switch>
          <Route
            exact
            name="nation"
            path="/explore"
            component={DataExplorer}
          />
          <Redirect from="/" to="/explore" />
        </Switch>
      </App>
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
