import React, { Fragment, useEffect } from "react";
import { Box, withStyles } from "@material-ui/core";
import MovieCarousel from "../components/MovieCarousel/MovieCarousel";
import MovieBanner from "../components/MovieBanner/MovieBanner";
import styles from "./styles";
import SkeletonHome from "../skeletons/SkeletonHome";
import { connect } from "react-redux";
import { getMovies, clearMovies } from "../../../../store/movie/movie.thunk";

const HomePage = (props) => {
   const {
      classes,
      getMovies,
      movies,
      loading
   } = props;

   useEffect(() => {
      getMovies();

      return () => {
         clearMovies();
      };
      //eslint-disable-next-line
   }, []);

   const randomMovie = movies[Math.floor(Math.random() * movies.length)];
   const suggested = movies.slice(2, 5);
   const nowShowing = movies.filter(movie => movie.category === "1");
   const comingSoon = movies.filter(movie => movie.category === "0");

   return (
      <Fragment>
         {loading ? (
            <SkeletonHome/>
         ) : (
            <Fragment>
               <MovieBanner movie={randomMovie} height="85vh"/>
               <Box height={60}/>
               <MovieCarousel
                  carouselClass={classes.carousel}
                  title="Suggested for you"
                  movies={suggested}
               />
               <MovieCarousel
                  carouselClass={classes.carousel}
                  title="Now Showing"
                  to="/movies/category/nowShowing"
                  movies={nowShowing}
               />
               <MovieCarousel
                  carouselClass={classes.carousel}
                  title="Coming Soon"
                  to="/movies/category/comingSoon"
                  movies={comingSoon}
               />
            </Fragment>
         )}
      </Fragment>
   );
};

const mapStateToProps = ({ movieState }) => ({
   movies: movieState.movies,
   loading: movieState.loading
});

export default connect(mapStateToProps, { getMovies, clearMovies })(withStyles(styles)(HomePage));