import * as ShowtimeActions from "./showtime.action";

const initialState = {
   showtimes: [],
   showtime: null,
   loading: false,
   error: null,
   tickets: []
};

export default function showtimesReducer(state = initialState, action) {
   switch (action.type) {
      case ShowtimeActions.GET_TICKETS_USER:
         return {
            ...state,
            loading: false,
            tickets: action.payload
         };
      case ShowtimeActions.GET_TICKETS:
         return {
            ...state,
            loading: false,
            tickets: action.payload
         };
      case ShowtimeActions.CLEAR_TEMP_SEATS:
         return {
            ...state,
            loading: false
         };
      case ShowtimeActions.SAVE_TEMP_SEATS_FAIL:
         return {
            ...state,
            loading: false,
            error: action.payload
         };
      case ShowtimeActions.UPDATE_SHOWTIME_SUCCESS:
      case ShowtimeActions.DELETE_SHOWTIME_SUCCESS:
      case ShowtimeActions.SAVE_SHOWTIME_SUCCESS:
      case ShowtimeActions.SAVE_TEMP_SEATS_SUCCESS:
         return {
            ...state,
            loading: false
         };
      case ShowtimeActions.FETCH_REQUEST:
         return {
            ...state,
            loading: true
         };
      case ShowtimeActions.GET_SHOWTIMES:
         return {
            ...state,
            showtimes: action.payload,
            loading: false
         };
      case ShowtimeActions.GET_SHOWTIME:
         return {
            ...state,
            showtime: action.payload,
            loading: false
         };
      case ShowtimeActions.FETCH_FAIL:
         return {
            ...state,
            loading: false
         };
      case ShowtimeActions.CLEAR_SHOWTIME:
         return {
            ...state,
            showtime: null
         };
      case ShowtimeActions.CLEAR_SHOWTIMES:
         return {
            ...state,
            showtimes: []
         };
      default:
         return state;
   }
};