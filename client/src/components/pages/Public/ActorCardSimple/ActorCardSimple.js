import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

const styles = (theme) => ({
  root: {
    maxWidth: 250,
  },
  media: {
    height: 350,
  },
  text: {
    backgroundColor: '#151F2E',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  h5: {
    textTransform: 'capitalize',
  },
  h6: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: '#7D7F82',
    textTransform: 'capitalize',
    fontSize: '0.7rem',
    height: 20
  }
});

const ActorCardSimple = (props) => {
  const { actor, classes, castName } = props;

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={actor.image}
        title={actor.name}
      />
      <CardContent className={classes.text}>
        <Typography
          className={classes.h5}
          gutterBottom
          variant="h5"
          component="h2"
          color="inherit"
        >
          {actor.name}
        </Typography>
        <Typography
          className={classes.h6}
          gutterBottom
          variant="h5"
          component="h2"
          color="inherit"
        >
          {castName}
        </Typography>
      </CardContent>
    </Card>
  );
};

ActorCardSimple.propTypes = {
  actor: PropTypes.object.isRequired,
};

export default withStyles(styles)(ActorCardSimple);
