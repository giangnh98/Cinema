import * as MovieActions from "./movie.action";

const initialState = {
   movies: [],
   movie: null,
   loading: false,
   error: null
};

export default function moviesReducer(state = initialState, action) {
   switch (action.type) {
      case MovieActions.FETCH_REQUEST:
         return {
            ...state,
            loading: true
         };
      case MovieActions.GET_MOVIES:
         return {
            ...state,
            movies: action.payload,
            loading: false
         };
      case MovieActions.GET_MOVIE:
         return {
            ...state,
            movie: action.payload,
            loading: false
         };
      case MovieActions.CREATE_MOVIE_SUCCESS:
      case MovieActions.UPDATE_MOVIE_SUCCESS:
      case MovieActions.DELETE_MOVIE_SUCCESS:
      case MovieActions.FETCH_FAIL:
         return {
            ...state,
            loading: false
         };
      case MovieActions.CLEAR_MOVIE:
         return {
            ...state,
            movie: null
         };
      case MovieActions.CLEAR_MOVIES:
         return {
            ...state,
            movies: []
         };
      default:
         return state;
   }
};