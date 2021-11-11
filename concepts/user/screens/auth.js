import React, { useEffect } from 'react';
import {
  View
} from 'react-native';
import { useSelector } from 'react-redux';
import { StackActions } from '@react-navigation/native';

import ConfirmEmail from '../components/confirmEmail';
import LoginOrSignUp from '../components/loginOrSignup';

const AuthScreen = (props) => {
  useEffect(() => {
    props.navigation.setOptions({
      headerRight: null
    });
  }, []);

  const isLoggedIn = useSelector(state => state.user.loggedIn);
  const loggedInAndEmailVerified = useSelector(state => state.user.loggedInAndEmailVerified);

  useEffect(() => {
    if (loggedInAndEmailVerified) {
      props.navigation.dispatch(StackActions.pop(1));
    }
  }, [loggedInAndEmailVerified]);


  return isLoggedIn ? loggedInAndEmailVerified ? <View /> : <ConfirmEmail {...props} /> : <LoginOrSignUp {...props} />;
};

export default AuthScreen;
