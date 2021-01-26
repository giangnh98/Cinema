export const GET_SHOWTIMES = "@@Showtime/GetShowtimes";
export const GET_SHOWTIME = "@@Showtime/GetShowtime";
export const FETCH_REQUEST = "@@Showtime/FetchRequest";
export const FETCH_FAIL = "@@Showtime/FetchFail";
export const CLEAR_SHOWTIMES = "@@Showtime/ClearShowtimes";
export const CLEAR_SHOWTIME = "@@Showtime/ClearShowtimes";
export const CLEAR_TEMP_SEATS = "@@Showtime/ClearTempSeats";
export const SAVE_TEMP_SEATS_SUCCESS = "@@Showtime/SaveTempSeatsSuccess";
export const SAVE_TEMP_SEATS_FAIL = "@@Showtime/SaveTempSeatsFail";
export const GET_TICKETS = "@@Showtime/GetTickets";
export const GET_TICKETS_USER = "@@Showtime/GetTicketsUser";
export const SAVE_SHOWTIME_SUCCESS = "@@Showtime/SaveShowtimeSuccess";
export const UPDATE_SHOWTIME_SUCCESS = "@@Showtime/UpdateShowtimeSuccess";
export const DELETE_SHOWTIME_SUCCESS = "@@Showtime/DeleteShowtimeSuccess";

export const actions = {
   setShowtimes: (showtimes) => {
      return { type: GET_SHOWTIMES, payload: showtimes };
   },
   saveShowtimeSuccess: () => {
      return { type: SAVE_SHOWTIME_SUCCESS };
   },
   updateShowtimeSuccess: () => {
      return { type: UPDATE_SHOWTIME_SUCCESS };
   },
   deleteShowtimeSuccess: () => {
      return { type: DELETE_SHOWTIME_SUCCESS };
   },
   setShowtime: (showtime) => {
      return { type: GET_SHOWTIME, payload: showtime };
   },
   setTicketsUser: (tickets) => {
      return { type: GET_TICKETS_USER, payload: tickets };
   },
   setTickets: (tickets) => {
      return { type: GET_TICKETS, payload: tickets };
   },
   saveTempSeatsSuccess: () => {
      return { type: SAVE_TEMP_SEATS_SUCCESS };
   },
   saveTempSeatsFail: (error) => {
      return { type: SAVE_TEMP_SEATS_FAIL, payload: error };
   },
   fetchRequest: () => {
      return { type: FETCH_REQUEST };
   },
   fetchFail: () => {
      return { type: FETCH_FAIL };
   },
   removeShowtimes: () => {
      return { type: CLEAR_SHOWTIMES };
   },
   clearTempSeats: () => {
      return { type: CLEAR_TEMP_SEATS };
   },
   removeShowtime: () => {
      return { type: CLEAR_SHOWTIME };
   }
};