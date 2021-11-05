import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './login';
import SignupScreen from './signup';

const Stack = createNativeStackNavigator();
const UserNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Sign up" component={SignupScreen} />
    </Stack.Navigator>
  );
};

export default UserNavigator;