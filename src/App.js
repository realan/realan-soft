import React, { useEffect } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";

// styles
import "./App.css";

// // fontawesome
// import initFontAwesome from "./utils/initFontAwesome";
// initFontAwesome();

const App = () => {
  // const { user, isLoading, error } = useAuth0();

  // useEffect(() => {
  //   console.log("user data", user);
  // }, [user]);

  // if (error) {
  //   return <div>Oops... {error.message}</div>;
  // }

  // if (isLoading) {
  //   return "<Loading />";
  // }

  return (
    <Router history={history}>
      <Switch>
        <Route path="/auth" component={AuthLayout} />
        <Route path="/admin" component={AdminLayout} />
        <Redirect from="/" to="/admin/dashboard" />
      </Switch>
    </Router>
  );
};

export default App;
