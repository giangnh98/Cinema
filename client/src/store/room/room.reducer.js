import * as RoomActions from "./room.action";

const initialState = {
   rooms: [],
   room: null,
   loading: false,
   error: null,
};

export default function roomsReducer(state = initialState, action) {
   switch (action.type) {
      case RoomActions.FETCH_REQUEST:
         return {
            ...state,
            loading: true
         };
      case RoomActions.GET_ROOMS:
         return {
            ...state,
            rooms: action.payload,
            loading: false
         };
      case RoomActions.GET_ROOM:
         return {
            ...state,
            room: action.payload,
            loading: false
         };
      case RoomActions.FETCH_FAIL:
         return {
            ...state,
            loading: false,
         };
      case RoomActions.CLEAR_ROOM:
         return {
            ...state,
            room: null
         };
      case RoomActions.CLEAR_ROOMS:
         return {
            ...state,
            rooms: []
         };
      default:
         return state;
   }
};