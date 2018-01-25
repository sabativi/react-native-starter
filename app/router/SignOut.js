import React from "react";
import { StackNavigator } from "react-navigation";

import Login from "../screens/Login";

const SignedOut = StackNavigator({
  SignIn: {
    screen: Login,
    navigationOptions: {
      header: null,
    }
  }
});

export default SignedOut;