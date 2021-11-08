import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, NativeModules } from 'react-native'

import { api_key } from "../../backend/firebase";

import * as names from './names'

const authStorageKey = 'authUserData';
const saveAuthDataToStorage = (resData) => {
  AsyncStorage.setItem(
    authStorageKey,
    JSON.stringify(resData)
  );
};

const authenticate = (authData, userData) => {
  return dispatch => {
    saveAuthDataToStorage(authData);
    dispatch({ type: names.AUTHENTICATE, authData: authData, userData: userData });
  };
};

const handleError = (errorResData) => {
  return dispatch => {
    const errorId = errorResData.error.message;
    if (errorId == 'INVALID_ID_TOKEN' || errorId == 'USER_NOT_FOUND') {
      dispatch({ type: names.LOGOUT });
    } else {
      let message = `Something went wrong!: ${errorId}`;
      throw new Error(message);
    }
  };
};

export const signup = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${api_key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      await dispatch(
        handleError(errorResData)
      );
      return;
    }

    const resData = await response.json();
    await dispatch(
      resendVerificationEmail(resData)
    );
    await dispatch(
      authenticate(resData)
    );
  };
};

export const resendVerificationEmail = (authData) => {
  return async dispatch => {
    const deviceLanguage =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
        : NativeModules.I18nManager.localeIdentifier;

    await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${api_key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Firebase-Locale': deviceLanguage
        },
        body: JSON.stringify({
          requestType: 'VERIFY_EMAIL',
          idToken: authData.idToken
        })
      }
    );
  }
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${api_key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      await dispatch(
        handleError(errorResData)
      );
      return;
    }

    const authData = await response.json();
    await dispatch(
      authenticate(authData)
    );
    await dispatch(
      refreshUserData(authData)
    );
  };
};

const userStorageKey = 'userUserData';
const saveUserDataToStorage = (resData) => {
  AsyncStorage.setItem(
    userStorageKey,
    JSON.stringify(resData)
  );
};
const userInfo = (resData) => {
  return dispatch => {
    saveUserDataToStorage(resData);
    dispatch({ type: names.USER_DATA, userData: resData });
  };
};

export const refreshUserData = (user) => {
  return async dispatch => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${api_key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idToken: user.idToken
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      await dispatch(
        handleError(errorResData)
      );
      return;
    }

    const resData = await response.json();
    if (resData.users && resData.users.length >= 1) {
      await dispatch(
        userInfo(resData.users[0])
      );
    }
  };
};

export const tryLogin = () => {
  return async dispatch => {
    const authDataStr = await AsyncStorage.getItem(authStorageKey);
    if (authDataStr) {
      const authData = JSON.parse(authDataStr);

      const userDataStr = await AsyncStorage.getItem(userStorageKey);
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        await dispatch(
          authenticate(authData, userData)
        );
      } else {
        await dispatch(
          authenticate(authData)
        );
        await dispatch(
          refreshUserData(authData)
        );
      }
    }
  };
};

export const logout = () => {
  return async dispatch => {
    await AsyncStorage.removeItem(authStorageKey);
    await AsyncStorage.removeItem(userStorageKey);
    dispatch({ type: names.LOGOUT });
  };
}