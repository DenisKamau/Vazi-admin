import React from "react";
import { Redirect, Route } from "react-router";
import { getFromStorage } from "../utils/storage";

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      component={(props) => {
        const obj = getFromStorage("the_main_app");
        if (obj) {
          return <Component {...props} />;
        } else {
          return <Redirect to={"/signin"} />;
        }
      }}
    />
  );
};

export default PrivateRoute;
