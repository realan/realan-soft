// import './wdyr';
import React from "react";
import ReactDOM from "react-dom";
// import { createBrowserHistory } from "history";
// import { Router, Route, Switch, Redirect } from "react-router-dom";

// import AuthLayout from "layouts/Auth.js";
// import AdminLayout from "layouts/Admin.js";

import "assets/scss/material-dashboard-pro-react.scss?v=1.9.0";
// import { Auth0Provider } from "providers/Auth0Provider";
import { Auth0Provider } from "@auth0/auth0-react";
import { getConfig } from "./config";
import { ApolloProvider } from "@apollo/react-hooks";
import { client } from "providers/ClientApollo";
import App from "App";

// const hist = createBrowserHistory();

const onRedirectCallback = (appState) => {
  history.push(appState && appState.returnTo ? appState.returnTo : window.location.pathname);
};

// Please see https://auth0.github.io/auth0-react/interfaces/auth0provideroptions.html
// for a full list of the available properties on the provider
const config = getConfig();

const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  ...(config.audience ? { audience: config.audience } : null),
  redirectUri: window.location.origin,
  onRedirectCallback,
};

ReactDOM.render(
  <Auth0Provider {...providerConfig}>
    <ApolloProvider client={client}>
      <App />
      {/* <Router history={hist}>
        <Switch>
          <Route path="/auth" component={AuthLayout} />
          <Route path="/admin" component={AdminLayout} />
          <Redirect from="/" to="/admin/dashboard" />
        </Switch>
      </Router> */}
    </ApolloProvider>
  </Auth0Provider>,
  document.getElementById("root")
);
