import React, { useEffect } from "react";
import MovieBanner from "../components/MovieBanner/MovieBanner";
import CustomLinearProgress from "../../../Loading/LinearProgress";
import PropsTypes from "prop-types";
import { connect } from "react-redux";
import { clearMovie, getMovieById } from "../../../../store/movie/movie.thunk";

const MoviePage = (props) => {
   const { getMovieById, movie, loading, clearMovie } = props;
   useEffect(() => {
      getMovieById(props.match.params.id);

      return () => {
         clearMovie();
      };
      //eslint-disable-next-line
   }, [props.match.params.id]);

   return (
      <div style={{ overflow: "hidden", height: "100vh" }}>
         <CustomLinearProgress loading={loading}/>
         {movie && <MovieBanner movie={movie} fullDescription/>}
      </div>
   );
};

MoviePage.propsType = {
   match: PropsTypes.any.isRequired
};

const mapStateToProps = ({ movieState }) => ({
   movie: movieState.movie,
   loading: movieState.loading
});

const mapDispatchToProps = {
   getMovieById,
   clearMovie
};

export default connect(mapStateToProps, mapDispatchToProps)(
   MoviePage
);