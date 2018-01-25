import { AsyncStorage } from "react-native";
import { NavigationActions } from "react-navigation";

export const USER_KEY = "auth-key";

export const ResetToSignedOut = NavigationActions.reset({
  index: 0,
  key: null,
  actions: [NavigationActions.navigate({ routeName: 'SignedOut' })],
}) 

export const ResetToSignedIn = NavigationActions.reset({
  index: 0,
  key: null,
  actions: [
    NavigationActions.navigate({ routeName: 'SignedIn' })
  ]
})

export const onSignIn = ({ email, password }) => {
  // login logic here
  return AsyncStorage.setItem(USER_KEY, "true");
}

export const onSignOut = () => {
  // logout here
  return AsyncStorage.removeItem(USER_KEY);
}

export const onSignUp = () => {
  // Signup logic here
  return AsyncStorage.setItem(USER_KEY, "true");
}

export const onForgetPw = ({ email }) => {
  return setTimeout(() => {
    
  }, 250);
}

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(USER_KEY)
      .then(res => {
        if (res !== null) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};