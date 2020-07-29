import * as CinemaActions from "./cinema.action";

const initialState = {
   cinemas: [],
   cinema: null,
   loading: false
};

export default function cinemasReducer(state = initialState, action) {
   switch (action.type) {
      case CinemaActions.GET_CINEMAS:
         return {
            ...state,
            cinemas: action.payload,
            loading: false
         };
      case CinemaActions.GET_CINEMA:
         return {
            ...state,
            cinema: action.payload,
            loading: false
         };
      case CinemaActions.FETCH_REQUEST:
         return {
            ...state,
            loading: true
         };
      case CinemaActions.SAVE_CINEMA_SUCCESS:
      case CinemaActions.DELETE_CINEMA_SUCCESS:
      case CinemaActions.CREATE_CINEMA_SUCCESS:
      case CinemaActions.FETCH_FAIL:
         return {
            ...state,
            loading: false
         };
      case CinemaActions.CLEAR_CINEMAS:
         return {
            ...state,
            cinemas: []
         };
      default:
         return state;
   }
};