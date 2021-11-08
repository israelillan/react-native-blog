import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import * as authActions from '../concepts/user/actions';

import AuthScreen from '../concepts/user/screens/auth';

import PostsListScreen from '../concepts/post/screens/list';

const RootNavigator = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    async function asyncTryLogin() {
      await dispatch(authActions.tryLogin());
    }
    asyncTryLogin();
  }, []);

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Auth'>
        <Stack.Screen name="Posts" component={PostsListScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
