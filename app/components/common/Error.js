import React from 'react';
import { StyleSheet } from 'react-native';
import Text from './Text';

const customStyles = StyleSheet.create({
  error: {
    color: "red"
  }
});

const Error = ({ style, error, ...others }) => (
  <Text style={[customStyles.error, style]} {...others}>
    {error}
  </Text>
);

export default Error;
