import React, { Fragment } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { Rating } from '@material-ui/lab';
import { Box, Typography, Button, withStyles, Link } from '@material-ui/core';
import { textTruncate } from '../../../../../ultils/utils';
import ArrowRightAlt from '@material-ui/icons/ArrowRightAlt';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import styles from './styles';
import '../../../../../assets/scss/model-video.css';
import ModalVideo from 'react-modal-video';
import PropsType from 'prop-types';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';

const StyledRating = withStyles({
  iconFilled: {
    color: '#fff',
  },
  iconEmpty: {
    color: '#fff',
  },
})(Rating);

const MovieBanner = (props) => {
  const {
    movie,
    fullDescription,
    classes,
    handleClose,
    videoId,
    open,
    handleShowToggle,
  } = props;

  if (!movie) return <div></div>;

  const date = new Date(movie.started);
  const releaseDay = moment(movie.started).format('DD/MM/YYYY');

  return (
    <div className={classes.movieHero}>
      <div className={classes.infoSection}>
        {fullDescription && (
          <Card className={classes.card}>
            <CardMedia
              className={classes.media}
              image={movie.image}
              title={movie.title}
            />
          </Card>
        )}
        <header className={classes.movieHeader}>
          {fullDescription && (
            <Box mb={3} display="flex" alignItems="center" flexWrap="wrap">
              {movie.genre &&
                movie.genre.split(',').map((genre, index) => (
                  <Typography
                    key={`${genre}-${index}`}
                    className={classes.tag}
                    variant="body1"
                    color="inherit"
                  >
                    {genre}
                  </Typography>
                ))}

              <StyledRating
                value={4}
                readOnly
                size="small"
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
              />
            </Box>
          )}
          <Typography
            className={classes.movieTitle}
            variant="h1"
            color="inherit"
          >
            {movie.title}
          </Typography>
          <Typography
            className={classes.descriptionText}
            variant="body1"
            color="inherit"
          >
            {textTruncate(movie.description, 450)}
          </Typography>
          <Typography className={classes.director} variant="h4" color="inherit">
            By : {movie.director}
          </Typography>
          <Typography
            className={classes.label}
            style={{ marginRight: 10 }}
            variant="body1"
            color="inherit"
          >
            {movie.label}
          </Typography>
          <Typography
            className={classes.duration}
            variant="body1"
            color="inherit"
          >
            {movie.duration} min
          </Typography>
          <Typography className={classes.genre} variant="body1" color="inherit">
            {movie.genre}
          </Typography>
          {fullDescription && (
            <Fragment>
              <br />
              <Typography
                className={classes.release}
                variant="body1"
                color="inherit"
              >
                {date > new Date() ? 'Coming Soon' : 'Now showing'} :{' '}
                {releaseDay}
              </Typography>
              <Box style={{ marginTop: 20 }}>
                <ModalVideo
                  channel="youtube"
                  autoplay
                  isOpen={open}
                  videoId={videoId}
                  onClose={handleClose}
                />
                {!(date > new Date()) && (
                  <Button
                    variant="contained"
                    size={'large'}
                    color={'primary'}
                    onClick={handleShowToggle}
                  >
                    Buy Tickets
                  </Button>
                )}
              </Box>
            </Fragment>
          )}
        </header>
      </div>
      <div
        className={classes.blurBackground}
        style={{
          backgroundImage: `url(${movie.poster})`,
        }}
      />
      <div className={classes.movieActions}>
        {!fullDescription && (
          <Link href={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
            <Button className={classnames(classes.button, classes.learnMore)}>
              Learn More
              <ArrowRightAlt className={classes.buttonIcon} />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

MovieBanner.propsType = {
  movie: PropsType.object.isRequired,
  fullDescription: PropsType.bool.isRequired,
};

export default withStyles(styles)(MovieBanner);
