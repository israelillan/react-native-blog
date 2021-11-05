import { database_url } from '../../backend/firebase';

import * as names from './names'
import Post from './post';

export const fetchPosts = () => {
    return async dispatch => {
      try {
        const response = await fetch(
          `${database_url}posts.json`
        );
  
        if (!response.ok) {
          throw new Error('Something went wrong!');
        }
  
        const resData = await response.json();
        const loadedPosts = [];
  
        for (const key in resData) {
          loadedPosts.push(
            new Post(
              key,
              resData[key]
            )
          );
        }
  
        dispatch({ type: names.SET_POSTS, posts: loadedPosts });
      } catch (err) {
        // send to custom analytics server
        throw err;
      }
    };
  };