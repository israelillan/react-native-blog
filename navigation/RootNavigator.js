import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { CommonActions } from '@react-navigation/native';

import PostNavigator from '../concepts/post/screens/navigator';
import UserNavigator from '../concepts/user/screens/navigator';
import ConfirmEmail from '../concepts/user/screens/confirmEmail';
import * as authActions from '../concepts/user/actions';

const Drawer = createDrawerNavigator();

const RootNavigator = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    async function asyncTryLogin(){
      await dispatch(authActions.tryLogin());
    }
    asyncTryLogin();
  }, []);
  
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const emailVerified = useSelector(state => state.user.emailVerified);
  const navRef = useRef(null);
  useEffect(() => {
    if (!!isLoggedIn) {
      if (emailVerified) {
        navRef.current.dispatch(
          CommonActions.navigate({ name: 'Post' })
        );
      } else {
        navRef.current.dispatch(
          CommonActions.navigate({ name: 'Confirm email' })
        );
      }
    }
  }, [isLoggedIn, emailVerified]);

  return (
    <NavigationContainer ref={navRef}>
      <Drawer.Navigator initialRouteName="Post">
        <Drawer.Screen name="Post" component={PostNavigator} options={{ headerShown: false }} />
        <Drawer.Screen name="User" component={UserNavigator} options={{ headerShown: false }} />
        <Drawer.Screen name="Confirm email" component={ConfirmEmail} options={{ headerShown: false }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
