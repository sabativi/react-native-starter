import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../components/common/Text";
import Icon from "../components/common/Icon";
import Button from "../components/common/Button";
import { onSignOut, ResetToSignedOut } from "../auth";

const styles = StyleSheet.create({
});

class SettingsScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: "Settings",
    tabBarIcon: ({ tintColor }) => <Icon name="cogs" color={tintColor} />
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, paddingVertical: 20 }}>
        <Button
          buttonStyle={{ backgroundColor: "#03A9F4" }}
          text="SIGN OUT"
          onPress={() => onSignOut().then(() => navigation.dispatch(ResetToSignedOut))}
        />
      </View>
    );
  }
}

export default SettingsScreen;
