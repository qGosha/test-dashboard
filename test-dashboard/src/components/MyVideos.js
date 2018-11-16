import React, { Component, Fragment } from "react";
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

const styles = {
  container: {
    marginTop: '2rem'
  },

  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
};


const MyVideos = (props) => {
  const { classes, allVideos } = props;
  const videos = allVideos.map( video => {
    return (
      <Card key={video.snippet.resourceId ? video.snippet.resourceId.videoId : video.id} className={classes.card}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={video.snippet.thumbnails.medium.url}
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


export default withStyles(styles)(MyVideos);
