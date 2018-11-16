import React, { Component, Fragment } from "react";
import {connect} from 'react-redux';
import * as actions from '../actions';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import firebase from 'firebase';
import Dropzone from 'react-dropzone';
import 'firebase/auth';
import history from '../helpers/history';
import { UploadVideo } from '../helpers/mediaUploader';
import TextField from '@material-ui/core/TextField';
import MyVideos from './MyVideos'

const styles = {
  container: {
   display: 'flex',
   flexWrap: 'wrap',
 },
 textField: {
   marginLeft: '5px',
   marginRight: '5px',
 },
 uploadB: {
   display: 'block'
 }
};


class Dashboard extends Component {
  state = {
    file: false,
    allVideos: [],
    myChannel: false,
    uploadingInProcess: false,
    percentageComplete: 0,
    error: false,
    description: '',
    title: '',
    tags: ''
  }
  getChannels = this.getChannels.bind(this);
  uploadVideo = this.uploadVideo.bind(this);
  deleteAllVideos = this.deleteAllVideos.bind(this);
  settingState = this.settingState.bind(this);
  componentDidMount() {
    this.getChannels();
  }

  settingState(prop, val) {
    this.setState({[prop]: val})
  }

  async uploadVideo(file) {
    const { description, title, tags, allVideos} = this.state;
    UploadVideo.prototype.settingState = this.settingState;
    UploadVideo.prototype.uploadFile(file, description, title, tags, allVideos);
    }

  deleteAllVideos() {
    let promiseArr = [];
    this.state.allVideos.map( video => {
      promiseArr.push( window.gapi.client.youtube.videos.delete({id: video.snippet.resourceId ? video.snippet.resourceId.videoId : video.id}) );
    });
    Promise.all(promiseArr).then(res => {
      if(res) {
        this.setState({allVideos: []});
      }
    }).catch( error => this.setState({error}))
  }

   async getChannels() {
     try {
       const channelsResponse = await window.gapi.client.youtube.channels.list({
         part:'contentDetails',
         mine: true,
       });
       const channels = channelsResponse.result.items;
       this.setState({myChannel: channels[0].id});
       channels.forEach( async item => {
         let nextPageToken = '';
         let result;
          do {
           result = await window.gapi.client.youtube.playlistItems.list({
             part:'snippet, id',
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
    return (
      <div>
      <h2>Dash</h2>
      <Button variant="contained" color="primary" onClick={() => firebase.auth().signOut()}>Sign-out</Button>
      <Button variant="contained" color="primary" onClick={this.getChannels}>Get channels</Button>
      <Button variant="contained" color="primary" onClick={this.deleteAllVideos}>Delete all videos</Button>

      <div>
      <h3>My videos</h3>
      <form className={styles.container} noValidate autoComplete="off">
        <TextField
          required
          id="outlined-required"
          label="Title"
          className={styles.textField}
          value={this.state.title}
          onChange={(e) => this.settingState('title', e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <TextField
          required
          id="outlined-required"
          label="Description"
          value={this.state.description}
          onChange={(e) => this.settingState('description', e.target.value)}
          className={styles.textField}
          margin="normal"
          variant="outlined"
        />
        <TextField
          required
          id="outlined-required"
          label="Tags"
          value={this.state.tags}
          onChange={(e) => this.settingState('tags', e.target.value)}
          className={styles.textField}
          margin="normal"
          variant="outlined"
        />

      <input
        accept="video/image"
        style={{display: 'none'}}
        id="raised-button-file"
        multiple
        type="file"
        // onChange={(e) =>this.setState({file: e.target.files}, () => this.uploadVideo()) }
        onChange={(e) => this.uploadVideo(e.target.files[0]) }

      />
      <label htmlFor="raised-button-file" style={styles.uploadB}>
      <Button disabled={this.state.uploadingInProcess} variant="contained" component="span" variant="contained" color="secondary">
        Upload
      </Button>
      </label>
      </form>
      </div>
      <MyVideos allVideos={this.state.allVideos} />
      </div>
    )
  }
}
export default withStyles(styles)(Dashboard);
