import React from "react";
import {connect} from 'react-redux';
import * as actions from '../actions';
import YouTube from 'react-youtube';


const Player = (props) => {
  const { videoId } = props.player;
  const opts = {
     height: '390',
     width: '640',
     playerVars: { // https://developers.google.com/youtube/player_parameters
       autoplay: 0
     }
   };
     const onReady = event => event.target.pauseVideo();
  return (
    <YouTube
       videoId={videoId}
       opts={opts}
       onReady={onReady}
     />
  )
}

const mapStateToProps = state => ({
  player: state.player
})

export default connect(mapStateToProps, null)(Player);
