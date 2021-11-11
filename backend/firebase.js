import AsyncStorage from '@react-native-async-storage/async-storage';

import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getDatabase, ref } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbHTCbQKkjbtB9jt41XorpD5KudqsR8m4",
  authDomain: "react-native-blog-1233b.firebaseapp.com",
  databaseURL: "https://react-native-blog-1233b-default-rtdb.firebaseio.com",
  projectId: "react-native-blog-1233b",
  storageBucket: "react-native-blog-1233b.appspot.com",
  messagingSenderId: "935712063435",
  appId: "1:935712063435:web:476cc7cd97b7a1fa27c04e",
  measurementId: "G-5Z0GJBYZB8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, { /*persistence: getReactNativePersistence(AsyncStorage)*/ });
const database = getDatabase(app);
export const dbRef = ref(database);