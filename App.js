import React from 'react';
import { StyleSheet, View } from "react-native";
import { AppLoading, Asset, Font } from 'expo';
import { ApolloClient } from "apollo-client";
import { HttpLink, InMemoryCache } from "apollo-client-preset";
import { ApolloProvider, graphql } from "react-apollo";
import { createRootNavigator } from "./app/router/index";
import { isSignedIn } from "./app/auth";
import images from "./assets/images/index";
import fonts from "./assets/fonts/index";

const httpLink = new HttpLink({ uri: "https://fakerql.com/graphql" });

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    dataIdFromObject: e => e.id
  })
});

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    }
    return Asset.fromModule(image).downloadAsync();
  });
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      appIsReady: false,
      signedIn: false,
      checkedSignIn: false,
    };
    this._loadAsync = this._loadAsync.bind(this);
  }
  componentDidMount() {
    this._loadAsync();
  }
  componentWillMount() {
    isSignedIn()
      .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
      .catch(err => alert("An error occurred"));
  }
  async _loadAsync() {
    const imageAssets = cacheImages(Object.values(images));
    const fontAssets = await Font.loadAsync(fonts);
    try {
      await Promise.all(imageAssets);
    } catch (e) {
      console.warn('Error downloading assets', e); // eslint-disable-line
    }
  }
  render() {
    const { checkedSignIn, signedIn, appIsReady } = this.state;

    if (!appIsReady || !checkedSignIn) {
      return <AppLoading 
        startAsync={this._loadAsync}
        onError={console.warn}
        onFinish={() => this.setState({ appIsReady: true })}
      />;
    }

    const Layout = createRootNavigator(signedIn);

    return (
      <ApolloProvider client={client}>
        <Layout />
      </ApolloProvider>
    );
  }
}

export default App;
