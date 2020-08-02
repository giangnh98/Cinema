export const GET_ROOMS = "@@Room/GetRooms";
export const GET_ROOM = "@@Room/GetRoom";
export const FETCH_REQUEST = "@@Room/FetchRequest";
export const FETCH_FAIL = "@@Room/FetchFail";
export const CLEAR_ROOMS = "@@Room/ClearRooms";
export const CLEAR_ROOM = "@@Room/ClearRoom";
export const UPDATE_ROOM_SUCCESS = "@@Room/UpdateRoomSuccess";
export const CREATE_ROOM_SUCCESS = "@@Room/CreateRoomSuccess";

export const actions = {
   setRooms: (rooms) => {
      return { type: GET_ROOMS, payload: rooms };
   },
   updateRoomSuccess: () => {
      return { type: UPDATE_ROOM_SUCCESS };
   },
   createRoomSuccess: () => {
      return { type: CREATE_ROOM_SUCCESS };
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