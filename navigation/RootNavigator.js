import React, { useEffect, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HeaderButtons, Item, HeaderButton } from 'react-navigation-header-buttons';
import { MaterialIcons } from '@expo/vector-icons';

import * as authActions from '../concepts/user/actions';

import AuthScreen from '../concepts/user/screens/auth';
import PostsListScreen from '../concepts/post/screens/list';

const RootNavigator = ({navigation}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    async function asyncTryLogin() {
      await dispatch(authActions.tryLogin());
    }
    asyncTryLogin();
  }, []);

  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const emailVerified = useSelector(state => state.user.emailVerified);
  const navRef = useRef(null);

  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer ref={navRef}>
      <Stack.Navigator screenOptions={{
        headerRight: () => (
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
              iconName={isLoggedIn && emailVerified ? 'logout' : 'login'}
              IconComponent={MaterialIcons}
              iconSize={23}
              onPress={() => {
                if (isLoggedIn && emailVerified) {
                  dispatch(authActions.logout());
                } else {
                  navRef.current.navigate('Auth');
                }
              }}
            />
          </HeaderButtons>
        )
      }}>
        <Stack.Screen name="Posts" component={PostsListScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
