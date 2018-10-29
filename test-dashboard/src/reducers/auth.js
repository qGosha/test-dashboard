import { LOGIN_USER, LOGOUT_USER } from '../actions/types';

export function auth(state = null, action) {
 switch (action.type) {
 case LOGIN_USER:
  return { user: action.payload };
 case LOGOUT_USER:
  return { user: null };
  default: return state;
 }
}
