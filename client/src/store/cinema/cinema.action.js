export const GET_CINEMAS = "@@Cinema/GetCinemas";
export const GET_CINEMA = "@@Cinema/GetCinema";
export const CLEAR_CINEMAS = "@@Cinema/ClearCinemas";
export const CLEAR_CINEMA = "@@Cinema/ClearCinema";
export const FETCH_REQUEST = "@@Cinema/FetchRequest";
export const FETCH_FAIL = "@@Cinema/FetchFail";
export const CREATE_CINEMA_SUCCESS = "@@Cinema/CreateCinemaSuccess";
export const SAVE_CINEMA_SUCCESS = "@@Cinema/SaveCinemaSuccess";
export const DELETE_CINEMA_SUCCESS = "@@Cinema/DeleteCinemaSuccess";

export const actions = {
   setCinemas: (cinemas) => {
      return { type: GET_CINEMAS, payload: cinemas };
   },
   setCinema: (cinema) => {
      return { type: GET_CINEMA, payload: cinema };
   },
   createCinemaSuccess: () => {
      return { type: CREATE_CINEMA_SUCCESS };
   },
   saveCinemaSuccess: () => {
      return { type: SAVE_CINEMA_SUCCESS };
   },
   deleteCinemaSuccess: () => {
      return { type: DELETE_CINEMA_SUCCESS };
   },
   fetchRequest: () => {
      return { type: FETCH_REQUEST };
   },
   fetchFail: () => {
      return { type: FETCH_FAIL };
   },
   removeCinema: () => {
      return { type: CLEAR_CINEMA };
   },
   removeCinemas: () => {
      return { type: CLEAR_CINEMAS };
   }
};