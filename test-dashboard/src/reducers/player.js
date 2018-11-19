import { INITIATE_PLAYER } from '../actions/types';

export function player(state = null, action) {
 switch (action.type) {
 case INITIATE_PLAYER:
  return { videoId: action.payload };
  default: return state;
 }
}
