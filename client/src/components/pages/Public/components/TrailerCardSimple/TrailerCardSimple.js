import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import ReactPlayer from 'react-player/youtube';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

const styles = (theme) => ({
  root: {
    with: 533,
    height: 300,
    padding: theme.spacing(2),
    position: 'relative',
  },
  icon: {
    transition: '200ms ease-in-out',
    fontSize: 33,
    '&:hover': {
      fontSize: 32,
      color: '#808080'
    }
  },
  video: {
    with: '100%',
    height: '100%',
  },
  play_background: {
    cursor: 'pointer',
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 67,
    height: 67,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.7)',
  },
});

const TrailerCardSimple = (props) => {
  const { trailer, classes, handleOpen } = props;

  return (
    <div className={classes.root}>
      <div
        className={classes.play_background}
        onClick={() => handleOpen(trailer.videoId)}
      >
        <PlayArrowIcon className={classes.icon} />
      </div>
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${trailer.videoId}`}
        className={classes.video}
        style={{ pointerEvents: 'none' }}
        playIcon={<div />}
        light
      />
    </div>
  );
};

TrailerCardSimple.propTypes = {
  trailer: PropTypes.object.isRequired,
};

export default withStyles(styles)(TrailerCardSimple);
