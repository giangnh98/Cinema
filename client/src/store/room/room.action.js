export const GET_ROOMS = "@@Room/GetRooms";
export const GET_ROOM = "@@Room/GetRoom";
export const FETCH_REQUEST = "@@Room/FetchRequest";
export const FETCH_FAIL = "@@Room/FetchFail";
export const CLEAR_ROOMS = "@@Room/ClearRooms";
export const CLEAR_ROOM = "@@Room/ClearRoom";

export const actions = {
   setRooms: (rooms) => {
      return { type: GET_ROOMS, payload: rooms };
   },
   setRoom: (room) => {
      return { type: GET_ROOM, payload: room };
   },
   fetchRequest: () => {
      return { type: FETCH_REQUEST };
   },
   fetchFail: () => {
      return { type: FETCH_FAIL };
   },
   removeRooms: () => {
      return { type: CLEAR_ROOMS };
   },
   removeRoom: () => {
      return { type: CLEAR_ROOM };
   }
};