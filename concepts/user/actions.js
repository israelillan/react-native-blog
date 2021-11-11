import { auth } from "../../backend/firebase";
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  reload, 
  signOut } from "firebase/auth";

import * as names from './names'

export const watchUser = () => {
  return async dispatch => {
    onAuthStateChanged(auth, (userData) => {
      if (userData) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        dispatch({ type: names.USER_DATA, userData: userData });
      } else {
        dispatch({ type: names.LOGOUT });
      }
    });
  }
}

export const signup = (email, password) => {
  return async dispatch => {
    await createUserWithEmailAndPassword(auth, email, password);
    await dispatch(login(email, password));
    await dispatch(resendVerificationEmail())
  };
};

export const resendVerificationEmail = () => {
  return async () => {
    await sendEmailVerification(auth.currentUser);
  };
};

export const login = (email, password) => {
  return async () => {
    await signInWithEmailAndPassword(auth, email, password);
  };
};

export const resetPassword = (email) => {
  return async () => {
    await sendPasswordResetEmail(auth, email);
  };
};

export const logout = () => {
  return async () => {
    await signOut(auth);
  };
};

export const refreshUserData = (user) => {
  return async dispatch => {
    if (auth) {
      await reload(auth.currentUser);
      dispatch({ type: names.USER_DATA, userData: auth.currentUser });
    };
  };
};