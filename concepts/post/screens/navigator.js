import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PostsListScreen from './list';

const Stack = createNativeStackNavigator();
const PostNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Posts" component={PostsListScreen} />
    </Stack.Navigator>
  );
};

export default PostNavigator;