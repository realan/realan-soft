// import './wdyr';
import React from "react";
import ReactDOM from "react-dom";

import "assets/scss/material-dashboard-pro-react.scss?v=1.9.0";
import { Auth0Provider } from "@auth0/auth0-react";

import { getConfig } from "./config";
import history from "./utils/history";
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
    </ApolloProvider>
  </Auth0Provider>,
  document.getElementById("root")
);
