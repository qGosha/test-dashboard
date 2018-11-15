import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { Provider } from "react-redux";
import reducers from "./reducers";
import reduxThunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import createAdminStore from './helpers/createAdminStore';
import jsonServerProvider from 'ra-data-json-server';
import history  from './helpers/history';

const authProvider = () => Promise.resolve();
const dataProvider = jsonServerProvider('http://jsonplaceholder.typicode.com');


//
// import {
//     adminReducer,
//     adminSaga,
//     createAppReducer,
//     defaultI18nProvider,
//     i18nReducer,
//     formMiddleware,
//     USER_LOGOUT,
// } from 'react-admin';
// import jsonServerProvider from 'ra-data-json-server';
// import { routerMiddleware } from 'react-router-redux';
// import createSagaMiddleware from 'redux-saga';
// import { all, fork } from 'redux-saga/effects';
// import history  from './helpers/history';
// import {
//     adminReducer,
//     i18nReducer
// } from 'react-admin';
//

// const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// sagaMiddleware.run(saga);

// const store = createStore(resettableAppReducer, {}, composeEnhancers(applyMiddleware(sagaMiddleware, reduxThunk, routerMiddleware(history))));

// const store = createStore(, {}, composeEnhancers(applyMiddleware()));



ReactDOM.render(
  <Provider
  store={createAdminStore({
          authProvider,
          dataProvider,
          history,
      })}
  >
    <App dataProvider={dataProvider}/>
  </Provider>,
  document.getElementById("root")
);;
