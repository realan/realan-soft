import React, { useEffect } from "react";
// import { Router, Route, Switch } from "react-router-dom";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";

// import { Container } from "reactstrap";

// import Loading from "./components/Loading/Loading";
// import NavBar from "./components/NavBar";
// import Footer from "./components/Footer";
// import Home from "./views/Home";
// import Profile from "./views/Profile";
// import ExternalApi from "./views/ExternalApi";
import { useAuth0 } from "@auth0/auth0-react";
// import history from "./utils/history";

const hist = createBrowserHistory();

// styles
import "./App.css";

// // fontawesome
// import initFontAwesome from "./utils/initFontAwesome";
// initFontAwesome();

const App = () => {
  const { user, isLoading, error } = useAuth0();

  useEffect(() => {
    console.log(user);
  }, [user]);

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return "<Loading />";
  }

  return (
    <Router history={hist}>
      <Switch>
        <Route path="/auth" component={AuthLayout} />
        <Route path="/admin" component={AdminLayout} />
        <Redirect from="/" to="/admin/dashboard" />
      </Switch>
    </Router>
  );
};

export default App;
