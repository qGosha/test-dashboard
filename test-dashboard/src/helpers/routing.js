import { Route,  Redirect } from 'react-router-dom';
import React from "react";

export const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={ props => {
      if (auth.user) { return <Component {...props} />; }
      else {
        return (
          <Redirect to={{
              pathname: "/login",
              state: { from: props.location }
            }}/>
        )
      }
    }
    }
  />
);

export const EnterRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={ props => {
      if (auth.user) {
        return (
          <Redirect
            to={{
              pathname: "/dashboard",
              state: { from: props.location }
            }}
          />
        )
      }
      else {
        return <Component {...props} />
      }
    }
    }
  />
);
