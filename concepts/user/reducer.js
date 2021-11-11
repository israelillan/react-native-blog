import * as names from './names'
import INTIAL_STATE from './state'

export default (state = INTIAL_STATE, action) => {
  switch (action.type) {
    case names.USER_DATA:
      return {
        ...state,
        loggedIn: !!action.userData && !action.userData.isAnonymous,
        loggedInAndEmailVerified: !!action.userData && !action.userData.isAnonymous && action.userData.emailVerified
      };
    case names.LOGOUT:
      return INTIAL_STATE;
    default:
      return state;
  }
};
