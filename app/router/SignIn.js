import React from "react";
import { TabNavigator } from "react-navigation";
import Home from "../screens/Home";
import Settings from "../screens/Settings";

const Router = TabNavigator({
  Home: {
    screen: Home
  },
  Settings: {
    screen: Settings
  }
});

export default Router;