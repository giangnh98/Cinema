import * as CinemaActions from "./cinema.action";
import { showErrors } from "../alert/alert.thunk";
import setAuthHeaders from "../../ultils/setAuthToken";

const {
   fetchRequest,
   fetchFail,
   removeCinema,
   removeCinemas,
   setCinema,
   setCinemas,
   saveCinemaSuccess,
   deleteCinemaSuccess,
   createCinemaSuccess
} = CinemaActions.actions;

export const getCinemas = () => async dispatch => {
   dispatch(fetchRequest());
   try {
      const url = "/api/cinemas/all";
      const response = await fetch(url, {
         method: "GET"
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(setCinemas(data));
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

export const getCinemaById = (cinemaId) => async dispatch => {
   dispatch(fetchRequest());
   try {
      const url = `/api/cinemas/${cinemaId}`;
      const response = await fetch(url, {
         method: "GET"
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(setCinema(data));
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

export const saveCinema = (
   {
      name, address, city, image, star
   }
) => async dispatch => {
   dispatch(fetchRequest());
   try {
      const url = `/api/cinemas`;
      const response = await fetch(url, {
         method: "POST",
         headers: setAuthHeaders({
            Accept: "application/json",
            "Content-Type": "application/json"
         }),
         body: JSON.stringify({name, address, city, image, star})
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(createCinemaSuccess());
         dispatch(showErrors("Create cinema success", "success"));
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

export const updateCinema = (
   id,
   {
      name, address, city, image, star
   }
) => async dispatch => {
   dispatch(fetchRequest());
   try {
      const url = `/api/cinemas/${id}`;
      const response = await fetch(url, {
         method: "PUT",
         headers: setAuthHeaders({
            Accept: "application/json",
            "Content-Type": "application/json"
         }),
         body: JSON.stringify({name, address, city, image, star})
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(saveCinemaSuccess());
         dispatch(showErrors("Update cinema success", "success"));
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

export const deleteCinema = (
   id
) => async dispatch => {
   dispatch(fetchRequest());
   try {
      const url = `/api/cinemas/${id}`;
      const response = await fetch(url, {
         method: "DELETE",
         headers: setAuthHeaders({
            Accept: "application/json",
            "Content-Type": "application/json"
         })
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(deleteCinemaSuccess());
         dispatch(showErrors("Delete cinema success", "success"));
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

export const clearCinemas = () => dispatch => {
   dispatch(removeCinemas());
};

export const clearCinema = () => dispatch => {
   dispatch(removeCinema());
};