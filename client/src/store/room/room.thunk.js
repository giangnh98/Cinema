import * as RoomActions from "./room.action";
import { showErrors } from "../alert/alert.thunk";
import setAuthHeaders from "../../ultils/setAuthToken";

const {
   fetchRequest,
   removeRoom,
   removeRooms,
   setRoom,
   setRooms,
   fetchFail,
   createRoomSuccess,
   updateRoomSuccess
} = RoomActions.actions;

export const getRooms = () => async dispatch => {
   dispatch(fetchRequest());

   try {
      const url = "/api/rooms";
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

export const createRoom = (
   {
      cinema, name, seats, structure
   }
) => async dispatch => {
   dispatch(fetchRequest());

   try {
      const url = "/api/rooms";
      const response = await fetch(url, {
         method: "POST",
         headers: setAuthHeaders({
            Accept: "application/json",
            "Content-Type": "application/json"
         }),
         body: JSON.stringify({ cinema, name, seats, structure })
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(createRoomSuccess());
         dispatch(showErrors("Create room success!", "success"));
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

export const updateRoom = (
   id,
   {
      cinema, name, seats, structure
   }
) => async dispatch => {
   dispatch(fetchRequest());

   try {
      const url = `/api/rooms/${id}`;
      const response = await fetch(url, {
         method: "PUT",
         headers: setAuthHeaders({
            Accept: "application/json",
            "Content-Type": "application/json"
         }),
         body: JSON.stringify({ cinema, name, seats, structure })
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(updateRoomSuccess());
         dispatch(showErrors("Update room success!", "success"));
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