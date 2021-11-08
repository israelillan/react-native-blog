import React, { useState } from 'react';
import {
    View,
    Text,
    Pressable
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

import ConfirmEmailScreen from './confirmEmail';
import LoginOrSignUpScreen from './loginOrSignup';
import * as authActions from '../actions';
import LogoutScreen from './logout';

const AuthScreen = props => {
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const emailVerified = useSelector(state => state.user.emailVerified);
//   const navRef = useRef(null);
//   useEffect(() => {
//     if (isLoggedIn) {
//       if (emailVerified) {
//         navRef.current.dispatch(
//           CommonActions.navigate({ name: 'Post' })
//         );
//       } else {
//         navRef.current.dispatch(
//           CommonActions.navigate({ name: 'Confirm email' })
//         );
//       }
//     }
//   }, [isLoggedIn, emailVerified]);

  return (
      <View>
          {isLoggedIn ? emailVerified ? <LogoutScreen {...props} /> : <ConfirmEmailScreen {...props} /> : <LoginOrSignUpScreen {...props}/>}
      </View>
  );
};

export default AuthScreen;
