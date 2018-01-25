import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StyleSheet } from "react-native";

const customStyles = StyleSheet.create({
  loader: {
    marginTop: 10
  }
});

const Loader = () => (
  <View style={customStyles.loader}>
    <ActivityIndicator size="large" />
  </View>
);

export default Loader;
