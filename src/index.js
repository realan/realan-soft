// import './wdyr';
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";

import "assets/scss/material-dashboard-pro-react.scss?v=1.9.0";
import { Auth0Provider } from "providers/Auth0Provider";
import { ApolloProvider } from "@apollo/react-hooks";
import { client } from "providers/ClientApollo";

const hist = createBrowserHistory();

ReactDOM.render(
  <Auth0Provider>
    <ApolloProvider client={client}>
      <Router history={hist}>
        <Switch>
          <Route path="/auth" component={AuthLayout} />
          <Route path="/admin" component={AdminLayout} />
          <Redirect from="/" to="/admin/dashboard" />
        </Switch>
      </Router>
    </ApolloProvider>
  </Auth0Provider>,
  document.getElementById("root")
);
