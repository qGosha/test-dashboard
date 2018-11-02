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



const app = firebase.initializeApp({
  apiKey: "AIzaSyDeki-PHjQHGKruxXz99PdOJ-QORzuPVNw",
  authDomain: "test-bbac8.firebaseapp.com",
  databaseURL: "https://test-bbac8.firebaseio.com",
  projectId: "test-bbac8",
  storageBucket: "test-bbac8.appspot.com",
  messagingSenderId: "143423192758",

  clientId: "963468815245-4clmmevmre64udfub6pn2rpk0vs7odnf.apps.googleusercontent.com",
  scopes: [
             "https://www.googleapis.com/auth/youtube.force-ssl",
             "https://www.googleapis.com/auth/youtube.upload"
    ],
    discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"
    ]  
});

const db = firebase.firestore();

db.settings({
  timestampsInSnapshots: true
});

class App extends Component {

  componentDidMount() {
   this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
       (user) => this.props.isSignedIn(user)
   );
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
        <PrivateRoute exact path='/' auth={auth} component={Dashboard}/>
        <PrivateRoute exact path='/dashboard' auth={auth} component={Dashboard}/>
        <EnterRoute exact path='/login' auth={auth} component={Login}/>
        <Route component={() => <div>404 Missing</div>} />
       </Switch>
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, actions)(App);
