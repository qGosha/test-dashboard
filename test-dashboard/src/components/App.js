import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { PrivateRoute, EnterRoute, ConfirmRoute } from '../helpers/routing';
import Login from './Login';
import Dashboard from './Dashboard';
import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import * as actions from '../actions';
import {connect} from 'react-redux';
import history  from '../helpers/history';
import { config } from '../helpers/config';
import {List} from './list';



const app = firebase.initializeApp(config);

const db = firebase.firestore();

db.settings({
  timestampsInSnapshots: true
});

class App extends Component {

  loadYoutubeApi(user) {
    if(!user) {
      return this.props.isSignedIn(user);
    }
      const script = document.createElement("script");
      script.type = 'text/javascript';
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
           window.gapi.load('client:auth2', () => {
             console.log({
               apiKey: config.apiKey,
               clientId: config.clientId,
               discoveryDocs: config.discoveryDocs,
               scope: config.scopes.join(' '),
             });
             window.gapi.client.init({
               apiKey: config.apiKey,
               clientId: config.clientId,
               discoveryDocs: config.discoveryDocs,
               scope: config.scopes.join(' '),
             }).then(() => {
                if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
                  window.gapi.client.load('youtube', 'v3', () =>  this.props.isSignedIn(user));
                } else {
                  firebase.auth().signOut();
                }
             })
           });
         };
      document.body.appendChild(script);
    }

  componentDidMount() {
   this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => this.loadYoutubeApi(user));
 }

 componentWillUnmount() {
  this.unregisterAuthObserver();
}

  render() {
    const { auth } = this.props;
    if(!auth) return null;
    return (
      <Router history={history}>
       <Switch>
        <PrivateRoute exact path='/' auth={auth} app={history} component={Dashboard}/>
        <PrivateRoute exact path='/dashboard' app={history} auth={auth} component={Dashboard}/>
        <PrivateRoute exact path='/admin' app={history} auth={auth} component={List}/>
        <EnterRoute exact path='/login' auth={auth} component={Login}/>
       </Switch>
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, actions)(App);
