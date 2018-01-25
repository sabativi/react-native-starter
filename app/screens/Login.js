import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
  LayoutAnimation,
  UIManager,
  KeyboardAvoidingView,
} from 'react-native';
import { Font } from 'expo';
import { Input, Button } from 'react-native-elements'
import images from '../../assets/images/index';

import Icon from '../components/common/Icon';
import Error from '../components/common/Error';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

import { onSignIn, onSignUp, onForgetPw, ResetToSignedIn  } from "../auth";

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental
  && UIManager.setLayoutAnimationEnabledExperimental(true);

const TabSelector = ({ selected }) => {
  return (
    <View style={styles.selectorContainer}>
      <View style={selected && styles.selected}/>
    </View>
  );
};

TabSelector.propTypes = {
  selected: PropTypes.bool.isRequired,
};

export default class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      selectedCategory: 0,
      error: null,
      isLoading: false,
      isEmailValid: true,
      isPasswordValid: true,
      isConfirmationValid: true,
    };

    this.selectCategory = this.selectCategory.bind(this);
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
    this.forgetPw = this.forgetPw.bind(this);
  }

  selectCategory(selectedCategory) {
    LayoutAnimation.easeInEaseOut();
    this.setState({
      selectedCategory,
      isLoading: false,
    });
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
  }

  async login() {
    const { email, password, } = this.state;
    const { navigation } = this.props;
    const isEmailValid = this.validateEmail(email);
    const isPasswordValid = password.length >= 8;
    if (!isEmailValid) {
      this.emailInput.shake();
    }
    if(!isPasswordValid) {
      this.passwordInput.shake();
    }
    this.setState({
      isEmailValid,
      isPasswordValid,
    });
    if(!isEmailValid || !isPasswordValid) {
      return;
    }
    this.setState({ 
      isLoading: true
    });
    try {
      await onSignIn({ email, password });
      navigation.dispatch(ResetToSignedIn);
    }
    catch(e) {
      this.setState({ error: e });
    }
    finally {
      LayoutAnimation.easeInEaseOut();
      this.setState({
        isLoading: false,
      });
    }
  }

  async forgetPw() {
    const { email } = this.state;
    const isEmailValid = this.validateEmail(email);
    if (!isEmailValid) {
      this.emailInput.shake();
    }
    this.setState({
      isEmailValid,
    });
    this.setState({ isLoading: true });
    try {
      await onForgetPw({ email });
      this.selectCategory(0);
    }
    catch(e) {
      this.setState({ error: e });
    }
    finally {
      LayoutAnimation.easeInEaseOut();
      this.setState({ isLoading: false });
    }
  }

  async signUp() {
    const {
      email,
      password,
      passwordConfirmation,
    } = this.state;
    const { navigation } = this.props;
    const isEmailValid = this.validateEmail(email);
    const isPasswordValid = password.length >= 8;
    const isConfirmationValid = password == passwordConfirmation;
    if (!isEmailValid) {
      this.emailInput.shake();
    }
    if(!isPasswordValid) {
      this.passwordInput.shake();
    }
    if(!isConfirmationValid) {
      this.confirmationInput.shake();
    }
    this.setState({
      isEmailValid,
      isPasswordValid,
      isConfirmationValid,
    });
    if(!isEmailValid || !isPasswordValid || !isConfirmationValid)  {
      return;
    }
    this.setState({ 
      isLoading: true
    });
    try {
      await onSignUp({ email, password });
      navigation.dispatch(ResetToSignedIn);
    }
    catch(e) {
      this.setState({ error: e });
    }
    finally {
      LayoutAnimation.easeInEaseOut();
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    const {
      selectedCategory,
      isLoading,
      isEmailValid,
      isPasswordValid,
      isConfirmationValid,
      email,
      password,
      passwordConfirmation,
      error,
    } = this.state;
    const isLoginPage = selectedCategory === 0;
    const isSignUpPage = selectedCategory === 1;
    const isForgetPage = selectedCategory === 2;
    return (
      <View style={styles.container}>
        <ImageBackground
          source={images.bgLogin}
          style={styles.bgImage}
        >
          <View>
            <KeyboardAvoidingView contentContainerStyle={styles.loginContainer} behavior='position'>
              <View style={styles.titleContainer}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.titleText}>BEAUX</Text>
                </View>
                <View style={{marginTop: -10, marginLeft: 10}}>
                  <Text style={styles.titleText}>VOYAGES</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Button
                  disabled={isLoading}
                  clear
                  activeOpacity={0.7}
                  onPress={() => this.selectCategory(0)}
                  textStyle={[styles.categoryText, isLoginPage && styles.selectedCategoryText]}
                  text={'Login'}
                />
                <Button
                  disabled={isLoading}
                  clear
                  activeOpacity={0.7}
                  onPress={() => this.selectCategory(1)}
                  textStyle={[styles.categoryText, isSignUpPage && styles.selectedCategoryText]}
                  text={'Sign up'}
                />
              </View>
              <View style={styles.rowSelector}>
                <TabSelector selected={isLoginPage}/>
                <TabSelector selected={isSignUpPage}/>
              </View>
              <View style={styles.formContainer}>
                <Input
                  icon={
                    <Icon
                      name='envelope-o'
                      color='rgba(0, 0, 0, 0.38)'
                      size={25}
                      style={{backgroundColor: 'transparent'}}
                    />
                  }
                  value={email}
                  keyboardAppearance='light'
                  autoFocus={false}
                  autoCapitalize='none'
                  autoCorrect={false}
                  keyboardType='email-address'
                  returnKeyType='next'
                  inputStyle={{marginLeft: 10}}
                  placeholder={'Email'}
                  containerStyle={{borderBottomColor: 'rgba(0, 0, 0, 0.38)'}}
                  ref={input => this.emailInput = input}
                  onSubmitEditing={() => this.passwordInput.focus()}
                  onChangeText={email => this.setState({ email })}
                  displayError={!isEmailValid}
                  errorMessage='Please enter a valid email address'
                />
                {!isForgetPage && <Input
                  icon={
                    <SimpleIcon
                      name='lock'
                      color='rgba(0, 0, 0, 0.38)'
                      size={25}
                      style={{backgroundColor: 'transparent'}}
                    />
                  }
                  value={password}
                  keyboardAppearance='light'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry={true}
                  returnKeyType={isSignUpPage ? 'next' : 'done'}
                  blurOnSubmit={true}
                  containerStyle={{marginTop: 16, borderBottomColor: 'rgba(0, 0, 0, 0.38)'}}
                  inputStyle={{marginLeft: 10}}
                  placeholder={'Password'}
                  ref={input => this.passwordInput = input}
                  onSubmitEditing={() => isSignUpPage ? this.confirmationInput.focus() : this.login()}
                  onChangeText={(password) => this.setState({password})}
                  displayError={!isPasswordValid}
                  errorMessage='Please enter at least 8 characters'
                />}
                {isSignUpPage &&
                  <Input
                    icon={
                      <SimpleIcon
                        name='lock'
                        color='rgba(0, 0, 0, 0.38)'
                        size={25}
                        style={{backgroundColor: 'transparent'}}
                      />
                    }
                    value={passwordConfirmation}
                    secureTextEntry={true}
                    keyboardAppearance='light'
                    autoCapitalize='none'
                    autoCorrect={false}
                    keyboardType='default'
                    returnKeyType={'done'}
                    blurOnSubmit={true}
                    containerStyle={{marginTop: 16, borderBottomColor: 'rgba(0, 0, 0, 0.38)'}}
                    inputStyle={{marginLeft: 10}}
                    placeholder={'Confirm password'}
                    ref={input => this.confirmationInput = input}
                    onSubmitEditing={this.signUp}
                    onChangeText={passwordConfirmation => this.setState({ passwordConfirmation })}
                    displayError={!isConfirmationValid}
                    errorMessage='Please enter the same password'
                  />}
                  <Button
                    buttonStyle={styles.loginButton}
                    containerStyle={{marginTop: 32, flex: 0}}
                    activeOpacity={0.8}
                    text={isLoginPage ? 'LOGIN' : isForgetPage ? 'SEND EMAIL' : 'SIGN UP'}
                    onPress={isLoginPage ? this.login : isForgetPage ? this.forgetPw : this.signUp}
                    textStyle={styles.loginTextButton}
                    loading={isLoading}
                    disabled={isLoading}
                  />
                  {error && <Error error={error} />}
                  {isLoginPage && <View style={styles.helpContainer}>
                    <Button
                      text={'Forget password ?'}
                      textStyle={{color: 'grey', fontSize: 14}}
                      buttonStyle={{backgroundColor: 'transparent'}}
                      underlayColor='transparent'
                      onPress={() => this.selectCategory(2)}
                    />
                  </View>
                }
              </View>
            </KeyboardAvoidingView>
            
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowSelector: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorContainer: {
    flex: 1,
    alignItems: 'center',
  },
  selected: {
    position: 'absolute',
    borderRadius: 50,
    height: 0,
    width: 0,
    top: -5,
    borderRightWidth: 70,
    borderBottomWidth: 70,
    borderColor: 'white',
    backgroundColor: 'white',
  },
  loginContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginTextButton: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: 'rgba(232, 147, 142, 1)',
    borderRadius: 10,
    height: 50,
    width: 200,
  },
  titleContainer: {
    height: 150,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    width: SCREEN_WIDTH - 30,
    borderRadius: 10,
    paddingTop: 32,
    paddingBottom: 32,
    alignItems:'center',
  },
  loginText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    backgroundColor: 'transparent',
    opacity: 0.54,
  },
  selectedCategoryText: {
    opacity: 1,
  },
  titleText: {
    color: 'white',
    fontSize: 30,
  },
  helpContainer: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
});