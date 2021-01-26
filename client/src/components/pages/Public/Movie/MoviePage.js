import React, { useEffect } from 'react';
import MovieBanner from '../components/MovieBanner/MovieBanner';
import CustomLinearProgress from '../../../Loading/LinearProgress';
import PropsTypes from 'prop-types';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Skeleton from '@material-ui/lab/Skeleton';
import {
  clearMovie,
  getMovieById,
  getCasts,
  getTrailers,
  getMoviesLabel,
} from '../../../../store/movie/movie.thunk';
import ActorCarousel from '../ActorCarousel/ActorCarousel';
import MovieCarousel from '../components/MovieCarousel/MovieCarousel';
import TrailerCarousel from '../components/TrailerCarousel/TrailerCarousel';
import { Box } from '@material-ui/core';
import ResponsiveDialog from '../../../ResponsiveDialog/ResponsiveDialog';
import AnimatedModal from '../components/AnimatedModal/AnimatedModal';

const MoviePage = (props) => {
  const [toggle, setToggle] = React.useState(false);

  const {
    getMovieById,
    getMoviesLabel,
    getCasts,
    getTrailers,
    movie,
    loading,
    clearMovie,
    moviesLabel,
    casts,
    trailers,
  } = props;

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);

  useEffect(() => {
    getMovieById(props.match.params.id);
    getCasts(props.match.params.id);
    getTrailers(props.match.params.id);
    getMoviesLabel(props.match.params.id, searchParams.get('label'));

    return () => {
      clearMovie();
    };
    //eslint-disable-next-line
  }, [props.match.params.id]);

  const [content, setContent] = React.useState({
    open: false,
    videoId: '',
  });

  const handleOpen = (videoId) => setContent({ open: true, videoId });

  const handleClose = () => setContent({ ...content, open: false });

  return (
    <div style={{ overflow: 'hidden' }}>
      <CustomLinearProgress loading={loading} />
      <ResponsiveDialog
        id="showtimes-movie"
        open={toggle}
        handleClose={() => setToggle(false)}
      >
        <AnimatedModal id={props.match.params.id} />
      </ResponsiveDialog>
      {movie ? (
        <MovieBanner
          movie={movie}
          fullDescription
          handleShowToggle={() => setToggle(true)}
          handleClose={handleClose}
          open={content.open}
          videoId={content.videoId}
        />
      ) : (
        <Skeleton variant="rect" height="100vh" />
      )}
      {casts.length > 0 && <ActorCarousel casts={casts} title="Casts" />}
      {trailers.length > 0 && (
        <TrailerCarousel
          trailers={trailers}
          title="Videos"
          handleOpen={handleOpen}
        />
      )}
      {moviesLabel.length > 0 && (
        <MovieCarousel title="Related Movies" movies={moviesLabel} />
      )}
      <Box height={100} />
    </div>
  );
};

MoviePage.propsType = {
  match: PropsTypes.any.isRequired,
};

const mapStateToProps = ({ movieState }) => ({
  movie: movieState.movie,
  moviesLabel: movieState.moviesLabel,
  casts: movieState.casts,
  trailers: movieState.trailers,
  loading: movieState.loading,
});

const mapDispatchToProps = {
  getMovieById,
  clearMovie,
  getCasts,
  getTrailers,
  getMoviesLabel,
};

export default connect(mapStateToProps, mapDispatchToProps)(MoviePage);
