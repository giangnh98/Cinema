import React, { Fragment, useEffect } from 'react';
import { Box, withStyles } from '@material-ui/core';
import MovieCarousel from '../components/MovieCarousel/MovieCarousel';
import MovieBanner from '../components/MovieBanner/MovieBanner';
import styles from './styles';
import SkeletonHome from '../skeletons/SkeletonHome';
import { connect } from 'react-redux';
import {
  getMoviesComingSoon,
  getMoviesNowShowing,
  clearMovies,
} from '../../../../store/movie/movie.thunk';

const HomePage = (props) => {
  const {
    classes,
    getMoviesComingSoon,
    getMoviesNowShowing,
    moviesComingSoon,
    moviesNowShowing,
  } = props;

  useEffect(() => {
    getMoviesComingSoon();
    getMoviesNowShowing();

    return () => {
      clearMovies();
    };
    //eslint-disable-next-line
  }, []);

  const randomMovie = moviesNowShowing[Math.floor(Math.random() * moviesNowShowing.length)];
  const suggested = moviesNowShowing.slice(2, 5);

  return (
    <Fragment>
      {!(moviesNowShowing.length > 0) ? (
        <SkeletonHome />
      ) : (
        <Fragment>
          <MovieBanner movie={randomMovie} height="85vh" />
          <Box height={60} />
          <MovieCarousel
            carouselClass={classes.carousel}
            title="Suggested for you"
            movies={suggested}
          />
          <MovieCarousel
            carouselClass={classes.carousel}
            title="Now Showing"
            to="/movies/category/nowShowing"
            movies={moviesNowShowing}
          />
          <MovieCarousel
            carouselClass={classes.carousel}
            title="Coming Soon"
            to="/movies/category/comingSoon"
            movies={moviesComingSoon}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

const mapStateToProps = ({ movieState }) => ({
  moviesComingSoon: movieState.moviesComingSoon,
  moviesNowShowing: movieState.moviesNowShowing,
});

export default connect(mapStateToProps, {
  getMoviesComingSoon,
  getMoviesNowShowing,
  clearMovies,
})(withStyles(styles)(HomePage));
