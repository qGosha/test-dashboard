import React from "react";
import {connect} from 'react-redux';
import * as actions from '../actions';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Redirect } from 'react-router'
import history  from '../helpers/history';


const styles = {
  container: {
    marginTop: '2rem'
  },

  process: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    zIndex: '100',
    opacity: '0.7',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    maxWidth: 345,
    position: 'relative'
  },
  media: {
    height: 140,
  },
};


const MyVideos = (props) => {
  const { classes, allVideos, currentlyProcessing, initiatePlayer } = props;
  const watchVideo = videoId => {
    initiatePlayer(videoId);
    history.push('/player');
  }
  const videos = allVideos.map( video => {
    const videoId = video.snippet.resourceId ? video.snippet.resourceId.videoId : video.id;
    return (
      <Card onClick={() => watchVideo(videoId)} key={videoId} className={classes.card}  style={styles.card}>
      { (currentlyProcessing === videoId) ? <div style={styles.process}><CircularProgress className={classes.progress} /></div> : null }
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={ (currentlyProcessing === videoId) ? 'processing' : video.snippet.thumbnails.medium.url }
          title={video.snippet.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {video.snippet.title}
          </Typography>
          <Typography component="p">
            {video.snippet.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Watch
        </Button>
        <Button size="small" color="primary">
          Delete
        </Button>
      </CardActions>
    </Card>
    )
  })
  return (
    <div style={styles.container}>
      {videos}
    </div>
  )
}


export default connect(null, actions)(withStyles(styles)(MyVideos));
