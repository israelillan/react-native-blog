import * as names from './names'
import INTIAL_STATE from './state'

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case names.AUTHENTICATE:
      return {
        ...state,
        authData: action.authData,
        isLoggedIn: true
      };
    case names.USER_DATA:
      return {
        ...state,
        userData: action.userData,
        emailVerified: action.userData.emailVerified
      };
    case names.LOGOUT:
      return INTIAL_STATE;
    default:
      return state;
  }
};
