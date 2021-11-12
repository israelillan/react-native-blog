import * as firebaseStorage from "firebase/storage";
import * as firebaseDatabase from "firebase/database";
import uuid from 'react-native-uuid';

import store from '../../store';

import * as names from './names';

const database = firebaseDatabase.getDatabase();
const databasePostsRef = firebaseDatabase.ref(database, `posts/`);

firebaseDatabase.onChildAdded(databasePostsRef, (data) => {
  store.dispatch({ type: names.ADD_POST, post: {
    ...data.val(),
    id: data.key,
  }});
});
firebaseDatabase.onChildChanged(databasePostsRef, (data) => {
  store.dispatch({ type: names.UPDATE_POST, post: {
    ...data.val(),
    id: data.key,
  }});
});
firebaseDatabase.onChildRemoved(databasePostsRef, (data) => {
  // console.log(`onChildRemoved`);
  // console.log(data);
});

export const fetchPosts = () => {
  return async () => {
    firebaseDatabase.query(databasePostsRef, firebaseDatabase.orderByChild('updateDate'));
    // const resData = await firebaseDatabase.get(databasePostsRef);
    // console.log(resData);
    // const loadedPosts = [];
    // for (const key in resData) {
    //   console.log(`key: ${key}`);
    //   const postData = {
    //     ...resData[key],
    //     id: key
    //   }
    //   loadedPosts.push(postData);
    // }

    // console.log(loadedPosts);

    // dispatch({
    //   type: names.SET_POSTS,
    //   posts: loadedPosts
    // });
    //   const response = await fetch(
    //     `${database_url}posts.json`
    //   );

    //   if (!response.ok) {
    //     throw new Error('Something went wrong!');
    //   }

    //   const resData = await response.json();
    //   const loadedPosts = [];

    //   for (const key in resData) {
    //     loadedPosts.push(
    //       new Post(
    //         key,
    //         resData[key]
    //       )
    //     );
    //   }

    //   dispatch({ type: names.SET_POSTS, posts: loadedPosts });
  };
};

const storage = firebaseStorage.getStorage();

const uriToBlob = (uri) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };

    xhr.onerror = function () {
      reject(new Error('uriToBlob failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);

    xhr.send(null);
  });
}

const getFilenameFromUrl = (url) => {
  return url.split('/').pop().split('#')[0].split('?')[0];
}

const getExtensionFromFilename = (filename) => {
  return filename.split('.').pop().trim();
}

export const createPost = (title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const imageBlob = await uriToBlob(imageUrl);

    const imageFilename = getFilenameFromUrl(imageUrl);
    const imageExtension = getExtensionFromFilename(imageFilename);

    const { user } = getState();

    const imageRef = firebaseStorage.ref(storage, `uploads/${user.id}/${uuid.v4()}.${imageExtension}`);
    await firebaseStorage.uploadBytes(imageRef, imageBlob, {
      contentType: `image/${imageExtension}`
    });
    const uploadedImageUrl = await firebaseStorage.getDownloadURL(imageRef);

    const post = {
      author: user.id,
      title,
      description,
      imageUrl: uploadedImageUrl,
      creationDate: firebaseDatabase.serverTimestamp(),
      updateDate: firebaseDatabase.serverTimestamp()
    };
    const id = await firebaseDatabase.push(databasePostsRef, post);
    post.id = id;
    post.creationDate = Date.now();
    post.updateDate = Date.now();
  };
};