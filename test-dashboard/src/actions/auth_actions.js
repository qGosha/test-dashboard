import { LOGIN_USER, LOGOUT_USER } from './types';

export const isSignedIn = (user) => async dispatch => {
  if(user) {
    dispatch({
      payload: user,
      type: LOGIN_USER
    });
  } else {
    dispatch({
      type: LOGOUT_USER
    });
  }

    };
