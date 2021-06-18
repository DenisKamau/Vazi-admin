import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import Category from "./containers/Category/Category";

import Home from "./containers/Home/Home";
import Orders from "./containers/Orders/Orders";
import Products from "./containers/Products/Products";
import Signin from "./containers/Signin/Signin";
import Signup from "./containers/Signup/Signup";
import Upload from "./containers/Upload/Upload";
import PrivateRoute from "./HOC/PrivateRoute";
import { useStateValue } from "./StateProvider";
import { getFromStorage } from "./utils/storage";

const App = () => {
  const [{ authenticate }, dispatch] = useStateValue();

  useEffect(() => {
    if (!authenticate) {
      const token = getFromStorage("the_main_app");
      const userDetails = getFromStorage("user");
      if (token) {
        dispatch({
          type: "UPDATE_TOKEN",
          item: token,
        });
        dispatch({
          type: "UPDATE_USER",
          item: {
            fullname: userDetails.user.fullname,
            username: userDetails.user.username,
          },
        });
      }
    }
  }, [authenticate]);

  return (
    <div className="App">
      <Switch>
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute path="/products" component={Products} />
        <PrivateRoute path="/orders" component={Orders} />
        <PrivateRoute path="/category" component={Category} />
        <PrivateRoute path="/upload" component={Upload} />

        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </div>
  );
};

export default App;
