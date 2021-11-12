import * as firebaseStorage from "firebase/storage";
import * as firebaseDatabase from "firebase/database";
import uuid from 'react-native-uuid';

import store from '../../store';

import * as names from './names';

const database = firebaseDatabase.getDatabase();
const postsCollection = 'posts';
const databasePostsRef = firebaseDatabase.ref(database, `${postsCollection}/`);

firebaseDatabase.onChildAdded(databasePostsRef, (data) => {
  store.dispatch({
    type: names.ADD_POST, post: {
      ...data.val(),
      id: data.key,
    }
  });
});
firebaseDatabase.onChildChanged(databasePostsRef, (data) => {
  store.dispatch({
    type: names.UPDATE_POST, post: {
      ...data.val(),
      id: data.key,
    }
  });
});
firebaseDatabase.onChildRemoved(databasePostsRef, (data) => {
  store.dispatch({
    type: names.DELETE_POST, post: {
      id: data.key,
    }
  });
});

export const fetchPosts = () => {
  return async () => {
    firebaseDatabase.query(databasePostsRef, firebaseDatabase.orderByChild('updateDate'));
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
};

const getFilenameFromUrl = (url) => {
  return url.split('/').pop().split('#')[0].split('?')[0];
};

const getExtensionFromFilename = (filename) => {
  return filename.split('.').pop().trim();
};

const uploadImageToServer = async (imageUrl, user) => {
  const imageBlob = await uriToBlob(imageUrl);

  const imageFilename = getFilenameFromUrl(imageUrl);
  const imageExtension = getExtensionFromFilename(imageFilename);

  const imageRef = firebaseStorage.ref(storage, `uploads/${user.id}/${uuid.v4()}.${imageExtension}`);
  await firebaseStorage.uploadBytes(imageRef, imageBlob, {
    contentType: `image/${imageExtension}`
  });
  return await firebaseStorage.getDownloadURL(imageRef);
};

export const createPost = (title, description, imageUrl) => {
  return async (_, getState) => {
    const { user } = getState();

    const uploadedImageUrl = await uploadImageToServer(imageUrl, user);

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

export const updatePost = (post, title, description, imageUrl) => {
  return async (_, getState) => {
    const { user } = getState();

    if (imageUrl.startsWith('file://')) {
      imageUrl = await uploadImageToServer(imageUrl, user);
    }

    const updates = {
      [post.id]: {
        title,
        description, 
        imageUrl,
        updateDate: firebaseDatabase.serverTimestamp()
      }
    }
    await firebaseDatabase.update(databasePostsRef, updates);
  };
};

export const deletePost = (post) => {
  return async () => {
    const postRef = firebaseDatabase.ref(database, `posts/${post.id}`);
    await firebaseDatabase.remove(postRef);
  };
};