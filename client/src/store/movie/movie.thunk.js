import * as MovieActions from "./movie.action";
import { showErrors } from "../alert/alert.thunk";
import setAuthHeaders from "../../ultils/setAuthToken";

const {
   fetchRequest,
   removeMovie,
   removeMovies,
   setMovie,
   setMovies,
   fetchFail,
   createMovieSuccess,
   deleteMovieSuccess,
   updateMovieSuccess
} = MovieActions.actions;

export const getMovies = (category = "") => async dispatch => {
   dispatch(fetchRequest());

   try {
      const url = `/api/movies/${category}`;
      const response = await fetch(url, {
         method: "GET"
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(setMovies(data));
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

export const getMovieById = (movieId) => async dispatch => {
   dispatch(fetchRequest());
   try {
      const url = `/api/movies/${movieId}`;
      const response = await fetch(url, {
         method: "GET"
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(setMovie(data));
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

export const saveMovie = (
   {
      title,
      region,
      description,
      genre,
      videoId,
      image,
      director,
      duration,
      started
   }
) => async dispatch => {
   dispatch(fetchRequest());
   try {
      const url = `/api/movies`;
      const response = await fetch(url, {
         method: "POST",
         headers: setAuthHeaders({
            Accept: "application/json",
            "Content-Type": "application/json"
         }),
         body: JSON.stringify({ title, region, description, genre, videoId, image, director, duration, started })
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(createMovieSuccess());
         dispatch(showErrors("Create movie success!", "success"));
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

export const updateMovie = (
   id,
   {
      title,
      region,
      description,
      genre,
      videoId,
      image,
      director,
      duration,
      started
   }
) => async dispatch => {
   dispatch(fetchRequest());
   try {
      const url = `/api/movies/${id}`;
      const response = await fetch(url, {
         method: "PUT",
         headers: setAuthHeaders({
            Accept: "application/json",
            "Content-Type": "application/json"
         }),
         body: JSON.stringify({ title, region, description, genre, videoId, image, director, duration, started })
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(updateMovieSuccess());
         dispatch(showErrors("Update movie success!", "success"));
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

export const deleteMovie = (id) => async dispatch => {
   dispatch(fetchRequest());
   try {
      const url = `/api/movies/${id}`;
      const response = await fetch(url, {
         method: "DELETE",
         headers: setAuthHeaders()
      });
      const data = await response.json();
      if (!data.error) {
         dispatch(deleteMovieSuccess());
         dispatch(showErrors("Delete movie success!", "success"));
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

export const clearMovie = () => async dispatch => {
   dispatch(removeMovie());
};

export const clearMovies = () => async dispatch => {
   dispatch(removeMovies());
};