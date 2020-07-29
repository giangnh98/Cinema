import * as RoomActions from "./room.action";
import { showErrors } from "../alert/alert.thunk";

const { fetchRequest, removeRoom, removeRooms, setRoom, setRooms, fetchFail } = RoomActions.actions;

export const getRooms = () => async dispatch => {
   dispatch(fetchRequest());

   try {
      const url = '/api/rooms';
      const response = await fetch(url, {
         method: "GET"
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(setRooms(data));
      }
      if (data.error) {
         dispatch(fetchFail());
         dispatch(showErrors(data.message, "error"));
      }
   } catch (error) {
      dispatch(fetchFail());
      dispatch(showErrors(error.message, "error"));
   }
};

export const getRoomById = (roomId) => async dispatch => {
   dispatch(fetchRequest());
   try {
      const url = `/api/rooms/${roomId}`;
      const response = await fetch(url, {
         method: "GET"
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(setRoom(data));
      }
      if (data.error) {
         dispatch(fetchFail());
         dispatch(showErrors(data.message, "error"));
      }
   } catch (error) {
      dispatch(fetchFail());
      dispatch(showErrors(error.message, "error"));
   }
};

export const clearRoom = () => async dispatch => {
   dispatch(removeRoom());
};

export const clearRooms = () => async dispatch => {
   dispatch(removeRooms());
};