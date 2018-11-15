import React, { Component, Fragment } from "react";
import { Admin, Resource, ListGuesser  } from 'react-admin';
import {connect} from 'react-redux';
import * as actions from '../actions';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import firebase from 'firebase';
import Dropzone from 'react-dropzone';
import 'firebase/auth';
import history from '../helpers/history';
import dataProvider  from '../helpers/dataProvider';
// import jsonServerProvider from 'ra-data-json-server';
// import {List} from './list';
// const dataProviderr = jsonServerProvider('http://jsonplaceholder.typicode.com');
// class Dashboard extends Component {
//   render() {
//     return (
//       <Admin dataProvider={dataProvider} authProvider={authProvider} loginPage={Login} customReducers={{ auth: authReducer }}>
//           <Resource name="videos" list={VideoList} show={VideoShow} create={VideoCreate} edit={VideoEdit} />
//       </Admin>
//     )
//   }
// }
//
// const mapStateToProps = (state) => ({
//   auth: state.auth,
// });
//
// export default connect(mapStateToProps, {action: 'svsv'})(Dashboard);

const styles = {

};

class Dashboard extends Component {
  state = {
    file: false,
    allVideos: [],
    myChannel: false,
  }
  getChannels = this.getChannels.bind(this);
  uploadVideo = this.uploadVideo.bind(this);

  componentDidMount() {
    this.getChannels();
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
  async uploadVideo(file) {
    console.dir(file);
    // var fileStream = new Blob([new Uint8Array(this.state.file[0])], {type: 'application/octet-stream'});
    // console.log(fileStream);
    //    console.log(fileStream.type);
    const data = new FormData()
    data.append('file', file, file.name)
    console.log(data);
    await window.gapi.client.youtube.videos.insert({
      part: 'snippet, status',
      media: {
        mimeType: 'application/octet-stream',
        body: file
    },
      resource: {
          snippet: {
              title: 'Video Test Title 5',
              description: 'Video Test Description',
              tags: ['Tag 1', 'Tag 2'],
              categoryId: "22"
          },
          status: {
              privacyStatus: "private"
          }
      }
  })
    }


   async getChannels() {
     try {
       const channelsResponse = await window.gapi.client.youtube.channels.list({
         part:'contentDetails, topicDetails, contentOwnerDetails',
         mine: true,
       });
       const channels = channelsResponse.result.items;
       this.setState({myChannel: channels[0].id});
       channels.forEach( async item => {
         let nextPageToken = '';
         let result;
          do {
           result = await window.gapi.client.youtube.playlistItems.list({
             part:'snippet',
             playlistId: item.contentDetails.relatedPlaylists.uploads,
             maxResults: 50,
             pageToken: nextPageToken
           });
           let allVideos = [...this.state.allVideos, ...result.result.items];
           this.setState({allVideos});
           nextPageToken = result.result.nextPageToken;
         } while (nextPageToken);
       })
     } catch (err) {
       console.log(err);
     }

  }
  render() {
     const { app } = this.props;
     const dataP = (props) => <dataProvider {...props} data={this.state.allVideos}/>
    return (
      <div>
      <h2>Dash</h2>
      <Button variant="contained" color="primary" onClick={() => firebase.auth().signOut()}>admin</Button>
      <Button variant="contained" color="primary" onClick={() => firebase.auth().signOut()}>Sign-out</Button>
      <Button variant="contained" color="primary" onClick={this.getChannels}>Get channels</Button>
      <div>
      <h3>My videos</h3>
      <input
        accept="video/image"
        style={{display: 'none'}}
        id="raised-button-file"
        multiple
        type="file"
        // onChange={(e) =>this.setState({file: e.target.files}, () => this.uploadVideo()) }
        onChange={(e) => this.uploadVideo(e.target.files[0]) }

      />
      <label htmlFor="raised-button-file">
      <Button variant="contained" component="span" variant="contained" color="secondary">
        Upload
      </Button>
      </label>
      // <span> { this.state.file ? this.state.file[0].name : null }</span>
      </div>
      </div>
    )
  }
}
export default withStyles(styles)(Dashboard);
