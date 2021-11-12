import React, { useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderButtons, Item, HeaderButton } from 'react-navigation-header-buttons';
import { MaterialIcons } from '@expo/vector-icons';

import { LogBox } from 'react-native';
// firebase sets up a long timer
LogBox.ignoreLogs(['Setting a timer']);

import * as navigationNames from './names';

import * as authActions from '../concepts/user/actions';

import AuthScreen from '../concepts/user/screens/auth';
import PostsListScreen from '../concepts/post/screens/list';
import AddPostScreen from '../concepts/post/screens/add';

const RootNavigator = () => {
  const dispatch = useDispatch();

  const loggedInAndEmailVerified = useSelector(state => state.user.loggedInAndEmailVerified);
  const navRef = useRef(null);

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer ref={navRef}>
      <Stack.Navigator screenOptions={{
        headerRight: () => (
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
              iconName={loggedInAndEmailVerified ? 'logout' : 'login'}
              IconComponent={MaterialIcons}
              iconSize={23}
              onPress={() => {
                if (loggedInAndEmailVerified) {
                  dispatch(authActions.logout());
                } else {
                  navRef.current.navigate(navigationNames.AUTH);
                }
              }}
            />
          </HeaderButtons>
        )
      }}>
        <Stack.Screen name={navigationNames.POSTS_LIST} component={PostsListScreen} />
        <Stack.Screen name={navigationNames.ADD_POSTS} component={AddPostScreen} />
        <Stack.Screen name={navigationNames.AUTH} component={AuthScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
