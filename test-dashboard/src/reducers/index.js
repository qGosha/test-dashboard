import { combineReducers } from 'redux';
import { reducer as form} from 'redux-form';
import { auth } from './auth';
import { player } from './player';

const rootReducer = combineReducers({
    auth,
    player
  });

export default rootReducer;
