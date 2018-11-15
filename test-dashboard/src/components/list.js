import React, { Component, Fragment } from "react";
import { Admin, Resource, ListGuesser  } from 'react-admin';
import history from '../helpers/history';
import {connect} from 'react-redux';
import jsonServerProvider from 'ra-data-json-server';
const dataProviderr = jsonServerProvider('http://jsonplaceholder.typicode.com');


export const List = (props) => {
  return(
    <Admin dataProvider={dataProviderr} history={props.app} title='gsdgsg'>
      <Resource name="users" list={ListGuesser} />
    </Admin>
  )
}
