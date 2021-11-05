import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import RootNavigator from './navigation/RootNavigator';

import postReducer from './concepts/post/reducer'
import userReducer from './concepts/user/reducer'

const rootReducer = combineReducers({
  post: postReducer,
  user: userReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
