import * as firebaseStorage from "firebase/storage";
import * as firebaseDatabase from "firebase/firestore";
import uuid from 'react-native-uuid';

import store from '../../store';

import * as names from './names';

const database = firebaseDatabase.getFirestore();
const postsCollectionName = 'posts';
const postsCollectionReference = firebaseDatabase.collection(database, postsCollectionName);

export const fetchPosts = () => {
  return async () => {
    const data = await firebaseDatabase.getDocs(firebaseDatabase.query(postsCollectionReference, firebaseDatabase.orderBy('updateDate', 'desc')));
    const posts = [];
    data.forEach((v) => {
      posts.push({
        ...v.data(),
        id: v.id
      });
    });
    await store.dispatch({
      type: names.SET_POSTS, posts: posts
    });
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

  const imageName = `uploads/${user.id}/${uuid.v4()}.${imageExtension}`;
  const imageRef = firebaseStorage.ref(storage, imageName);
  await firebaseStorage.uploadBytes(imageRef, imageBlob, {
    contentType: `image/${imageExtension}`
  });
  return {
    imageUrl: await firebaseStorage.getDownloadURL(imageRef),
    imageName
  };
};

export const createPost = (title, description, imageUrl) => {
  return async (_, getState) => {
    const { user } = getState();

    const { imageUrl: uploadedImageUrl, imageName } = await uploadImageToServer(imageUrl, user);

    const post = {
      author: user.id,
      title,
      description,
      imageUrl: uploadedImageUrl,
      imageName,
      creationDate: firebaseDatabase.serverTimestamp(),
      updateDate: firebaseDatabase.serverTimestamp()
    };

    const docRef = await firebaseDatabase.addDoc(postsCollectionReference, post);
    post.id = docRef.id;
    post.creationDate = {
      seconds: Date.now() / 1000
    };
    post.updateDate = {
      seconds: Date.now() / 1000
    };

    await store.dispatch({
      type: names.ADD_POST, post
    });
  };
};

export const updatePost = (post, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const { user } = getState();

    let imageName = post.imageName;
    if (imageUrl.startsWith('file://')) {
      const imageRef = firebaseStorage.ref(storage, post.imageName);
      await firebaseStorage.deleteObject(imageRef);

      imageUrl, imageName = await uploadImageToServer(imageUrl, user);
    }

    const updatedPost = {
      ...post,
      title,
      description,
      imageUrl,
      imageName,
      updateDate: firebaseDatabase.serverTimestamp()
    };
    const postDoc = firebaseDatabase.doc(database, `${postsCollectionName}/${post.id}`);
    await firebaseDatabase.updateDoc(postDoc, updatedPost);

    updatedPost.updateDate = {
      seconds: Date.now() / 1000
    };
    await dispatch({
      type: names.UPDATE_POST, post: updatedPost
    });
  };
};

export const deletePost = (post) => {
  return async (dispatch) => {
    const postDoc = firebaseDatabase.doc(database, `${postsCollectionName}/${post.id}`);
    await firebaseDatabase.deleteDoc(postDoc, post);

    const imageRef = firebaseStorage.ref(storage, post.imageName);
    await firebaseStorage.deleteObject(imageRef);

    await dispatch({
      type: names.DELETE_POST, post
    });
  };
};

export const selectPost = (post) => ({
  type: names.SELECT_POST,
  post: post
});
