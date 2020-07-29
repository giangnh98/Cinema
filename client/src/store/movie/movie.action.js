export const GET_MOVIES = "@@Movie/GetMovies";
export const GET_MOVIE = "@@Movie/GetMovie";
export const FETCH_REQUEST = "@@Movie/FetchRequest";
export const FETCH_FAIL = "@@Movie/FetchFail";
export const CLEAR_MOVIES = "@@Movie/ClearMovies";
export const CLEAR_MOVIE = "@@Movie/ClearMovie";
export const CREATE_MOVIE_SUCCESS = "@@Movie/CreateMovieSuccess";
export const UPDATE_MOVIE_SUCCESS = "@@Movie/UpdateMovieSuccess";
export const DELETE_MOVIE_SUCCESS = "@@Movie/DeleteMovieSuccess";

export const actions = {
   setMovies: (movies) => {
      return { type: GET_MOVIES, payload: movies };
   },
   createMovieSuccess: () => {
      return { type: CREATE_MOVIE_SUCCESS };
   },
   updateMovieSuccess: () => {
      return { type: UPDATE_MOVIE_SUCCESS };
   },
   deleteMovieSuccess: () => {
      return { type: DELETE_MOVIE_SUCCESS };
   },
   setMovie: (movie) => {
      return { type: GET_MOVIE, payload: movie };
   },
   fetchRequest: () => {
      return { type: FETCH_REQUEST };
   },
   fetchFail: () => {
      return { type: FETCH_FAIL };
   },
   removeMovies: () => {
      return { type: CLEAR_MOVIES };
   },
   removeMovie: () => {
      return { type: CLEAR_MOVIE };
   }
};