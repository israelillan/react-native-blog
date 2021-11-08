import React, { useEffect } from 'react';
import {
  View
} from 'react-native';
import { useSelector } from 'react-redux';
import { StackActions } from '@react-navigation/native';

import ConfirmEmailScreen from './confirmEmail';
import LoginOrSignUpScreen from './loginOrSignup';

const AuthScreen = (props) => {
  useEffect(() => {
    props.navigation.setOptions({
      headerRight: null
    });
  }, []);

  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const emailVerified = useSelector(state => state.user.emailVerified);

  useEffect(() => {
    if (isLoggedIn && emailVerified) {
      props.navigation.dispatch(StackActions.pop(1));
    }
  }, [isLoggedIn, emailVerified]);


  return isLoggedIn ? emailVerified ? <View /> : <ConfirmEmailScreen {...props} /> : <LoginOrSignUpScreen {...props} />;
};


export default AuthScreen;
