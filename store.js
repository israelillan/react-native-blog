import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import postReducer from './concepts/post/reducer'
import userReducer from './concepts/user/reducer'

const rootReducer = combineReducers({
  post: postReducer,
  user: userReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default store;