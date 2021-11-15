import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderButtons, Item, HeaderButton } from 'react-navigation-header-buttons';
import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

import { LogBox } from 'react-native';
// firebase sets up a long timer and uses old AsyncStorage
LogBox.ignoreLogs(['Setting a timer', 'AsyncStorage has been extracted']);

import * as paths from './paths';

import * as authActions from '../concepts/user/actions';

import AuthScreen from '../concepts/user/screens/auth';
import PostsListScreen from '../concepts/post/screens/list';
import AddPostScreen from '../concepts/post/screens/add';
import ViewPostScreen from '../concepts/post/screens/view';
import EditPostScreen from '../concepts/post/screens/edit';

const RootNavigator = () => {
  const dispatch = useDispatch();

  const loggedInAndEmailVerified = useSelector(state => state.user.loggedInAndEmailVerified);
  const navRef = useNavigationContainerRef();

  const Stack = createNativeStackNavigator();

  const prefix = Linking.createURL('/');
  const linking = {
    prefixes: [prefix],
    config: {
      initialRouteName: paths.POSTS_LIST,
      screens: {
        [paths.VIEW_POST]: 'post/:postId'
      }
    }
  };

  return (
    <NavigationContainer ref={navRef} linking={linking}>
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
                  navRef.current.navigate(paths.AUTH);
                }
              }}
            />
          </HeaderButtons>
        )
      }}>
        <Stack.Screen name={paths.POSTS_LIST} component={PostsListScreen} />
        <Stack.Screen name={paths.ADD_POST} component={AddPostScreen} />
        <Stack.Screen name={paths.VIEW_POST} component={ViewPostScreen} />
        <Stack.Screen name={paths.EDIT_POST} component={EditPostScreen} />
        <Stack.Screen name={paths.AUTH} component={AuthScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
