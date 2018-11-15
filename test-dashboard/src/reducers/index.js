import { combineReducers } from 'redux';
import { reducer as form} from 'redux-form';
import { auth } from './auth';
import {  routerReducer } from 'react-router-redux';

import {
    adminReducer,
    i18nReducer
} from 'react-admin';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
    admin: adminReducer,
    i18n: i18nReducer('en', {}),
    form: formReducer,
    routing: routerReducer,
    auth
  });

export default rootReducer;
