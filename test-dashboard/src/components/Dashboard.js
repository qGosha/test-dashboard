import React, { Component, Fragment } from "react";
import {connect} from 'react-redux';
import * as actions from '../actions';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import firebase from 'firebase';
import Dropzone from 'react-dropzone';

const styles = {

};

class Dashboard extends Component {
  state = {
    file: false
  }
  // addUser = async () => {
  //   try {
  //     const doc = await db.collection("users").add({
  //         first: "Ada",
  //         last: "Lovelace",
  //         born: 1815
  //     });
  //     console.log(doc);
  //   } catch (err) {
  //     console.log('There was an error' + err)
  //   }
  // }
  render() {
     const { app } = this.props;
    return (
      <div>
      <h2>Dash</h2>
      <Button variant="contained" color="primary" onClick={() => firebase.auth().signOut()}>Sign-out</Button>
      <div>
      <h3>My videos</h3>
      <input
        accept="video/*"
        style={{display: 'none'}}
        id="raised-button-file"
        multiple
        type="file"
        onChange={(e) =>this.setState({file: e.target.files}) }
      />
      <label htmlFor="raised-button-file">
      <Button variant="contained" component="span" variant="contained" color="secondary">
        Upload
      </Button>
      </label>
      <span> { this.state.file ? this.state.file[0].name : null }</span>
      </div>
      </div>
    )
  }
}
export default withStyles(styles)(Dashboard);
// <Dropzone accept='video/*'
//  onDropRejected={() => alert('please choose a video file')}
//  onDropAccepted={(file) => {
//    var xhr = new XMLHttpRequest();
//     xhr.upload.addEventListener("progress", function(evt){
//       if (evt.lengthComputable) {
//         var percentComplete = evt.loaded / evt.total;
//         console.log(percentComplete);
// }
// }, false);
// this.setState({file})
//  } }>
//    <div>Try dropping some files here, or click to select files to upload.</div>
// </Dropzone>
