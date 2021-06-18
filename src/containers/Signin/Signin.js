import React, { useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { useStateValue } from "../../StateProvider";
import axios from "../../axios";
import "./Signin.css";
import swal from "sweetalert";
import { setInStorage } from "../../utils/storage";

export default function Signin() {
  const [{ authenticate }, dispatch] = useStateValue();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const history = useHistory();

  const submitForm = (e) => {
    e.preventDefault();

    if (!Email || !Password) {
      swal("All fields required!", {
        buttons: false,
        icon: "error",
        timer: 1700,
      });
    } else {
      const variables = {
        password: Password,
        email: Email,
      };

      const abortController = new AbortController();
      const signal = abortController.signal;

      axios
        .post("account/admin/signin", variables, { signal: signal })
        .then((resp) => {
          if (resp.data.success) {
            swal({
              title: "Logged In",
              button: false,
              icon: "success",
              timer: 1700,
            });
            setInStorage("the_main_app", { token: resp.data.token });
            setInStorage("user", { user: resp.data.user });
            dispatch({
              type: "UPDATE_TOKEN",
              item: resp.data.token,
            });
            dispatch({
              type: "UPDATE_USER",
              item: resp.data.user,
            });
            setEmail("");
            setPassword("");
            history.push("/");
            abortController.abort();
          } else {
            swal("Incorrect Email/Password", {
              timer: 3000,
            });
            abortController.abort();
          }
        })
        .catch((err) => console.error(err));
    }
  };

  if (authenticate) {
    return <Redirect to={"/"} />;
  }

  return (
    <Layout>
      <div className="login">
        <div className="login__details">
          <h3>Welcome back!</h3>
          <p>Sign in to your account here:</p>
          <form onSubmit={submitForm} className="login__form">
            <div className="login__email">
              <label htmlFor="CustomerEmail">Email</label>
              <input
                type="email"
                value={Email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                id="CustomerEmail"
              />
            </div>
            <div className="login__password">
              <label htmlFor="CustomerPassword">Password</label>
              <input
                type="password"
                value={Password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                id="CustomerPassword"
              />
            </div>
          </form>

          <button onClick={submitForm} className="login__button">
            Sign In
          </button>
          <Link to="/signup" className="login__link">
            <p>Create Account</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
