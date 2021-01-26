import * as ShowtimeActions from './showtime.action';
import { showErrors } from '../alert/alert.thunk';
import setAuthHeaders from '../../ultils/setAuthToken';

const {
  fetchRequest,
  removeShowtime,
  removeShowtimes,
  setShowtime,
  setShowtimes,
  fetchFail,
  saveTempSeatsSuccess,
  saveTempSeatsFail,
  clearTempSeats,
  setTickets,
  setTicketsUser,
  saveShowtimeSuccess,
  updateShowtimeSuccess,
  deleteShowtimeSuccess,
} = ShowtimeActions.actions;

export const getTickets = () => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    const url = '/api/tickets';
    const response = await fetch(url, {
      method: 'GET',
    });
    const data = await response.json();
    if (!data.error) {
      dispatch(setTickets(data));
    }
    if (data.error) {
      dispatch(fetchFail());
      dispatch(showErrors(data.message, 'error'));
    }
  } catch (e) {
    dispatch(fetchFail());
    dispatch(showErrors(e.message, 'error'));
  }
};

export const getTicketsUser = () => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    const url = '/api/tickets/user';
    const response = await fetch(url, {
      method: 'GET',
      headers: setAuthHeaders(),
    });
    const data = await response.json();
    if (!data.error) {
      dispatch(setTicketsUser(data));
    }
    if (data.error) {
      dispatch(fetchFail());
      dispatch(showErrors(data.message, 'error'));
    }
  } catch (e) {
    dispatch(fetchFail());
    dispatch(showErrors(e.message, 'error'));
  }
};

export const getShowtimes = (movieId) => async (dispatch) => {
  dispatch(fetchRequest());

  try {
    const url = `/api/showtimes/movie/${movieId}`;
    const response = await fetch(url, {
      method: 'GET',
    });
    const data = await response.json();
    if (!data.error) {
      dispatch(setShowtimes(data));
    }
    if (data.error) {
      dispatch(fetchFail());
      dispatch(showErrors(data.message, 'error'));
    }
  } catch (error) {
    dispatch(fetchFail());
    dispatch(showErrors(error.message, 'error'));
  }
};

export const createShowtime = ({
  movie,
  released,
  room,
  seatPrice,
  time,
}) => async (dispatch) => {
  dispatch(fetchRequest());

  try {
    const url = '/api/showtimes';
    const response = await fetch(url, {
      method: 'POST',
      headers: setAuthHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ movie, released, room, seatPrice, time }),
    });
    const data = await response.json();
    if (!data.error) {
      dispatch(saveShowtimeSuccess(data));
      dispatch(showErrors('Create showtime success!', 'success'));
    }
    if (data.error) {
      dispatch(fetchFail());
      dispatch(showErrors(data.message, 'error'));
    }
  } catch (error) {
    dispatch(fetchFail());
    dispatch(showErrors(error.message, 'error'));
  }
};

export const updateShowtime = (
  id,
  { movie, released, room, seatPrice, time }
) => async (dispatch) => {
  dispatch(fetchRequest());

  try {
    const url = `/api/showtimes/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: setAuthHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ movie, released, room, seatPrice, time }),
    });
    const data = await response.json();
    if (!data.error) {
      dispatch(updateShowtimeSuccess());
      dispatch(showErrors('Update showtime success!', 'success'));
    }
    if (data.error) {
      dispatch(fetchFail());
      dispatch(showErrors(data.message, 'error'));
    }
  } catch (error) {
    dispatch(fetchFail());
    dispatch(showErrors(error.message, 'error'));
  }
};

export const deleteShowtime = (id) => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    const url = `/api/showtimes/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: setAuthHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    });
    const data = await response.json();
    if (!data.error) {
      dispatch(deleteShowtimeSuccess());
      return Promise.resolve({
        error: false,
        message: null,
      });
    } else if (data.error) {
      dispatch(fetchFail());
      return Promise.resolve({
        error: true,
        message: data.message,
      });
    }
  } catch (e) {
    dispatch(fetchFail());
    return Promise.resolve({
      error: true,
      message: e.message,
    });
  }
};

export const getAllShowtimes = () => async (dispatch) => {
  dispatch(fetchRequest());

  try {
    const url = '/api/showtimes';
    const response = await fetch(url, {
      method: 'GET',
    });
    const data = await response.json();
    if (!data.error) {
      dispatch(setShowtimes(data));
    }
    if (data.error) {
      dispatch(fetchFail());
      dispatch(showErrors(data.message, 'error'));
    }
  } catch (error) {
    dispatch(fetchFail());
    dispatch(showErrors(error.message, 'error'));
  }
};

export const createPrebooking = (seats, showtime) => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    const url = `/api/prebooking`;
    const response = await fetch(url, {
      method: 'POST',
      headers: setAuthHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        showtime: showtime,
        seats: seats,
      }),
    });
    const data = await response.json();
    if (!data.error) {
      dispatch(saveTempSeatsSuccess());
    }
    if (data.error) {
      dispatch(saveTempSeatsFail(data.message));
      dispatch(showErrors(data.message, 'error'));

      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  } catch (error) {
    dispatch(fetchFail());
    dispatch(showErrors(error.message, 'error'));
  }
};

export const removeTempSeats = (loading) => async (dispatch) => {
  if (loading) dispatch(fetchRequest());
  try {
    const url = `/api/prebooking`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: setAuthHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    });
    const data = await response.json();
    if (loading && !data.error) {
      dispatch(clearTempSeats());
    }
    if (data.error) {
      if (loading) dispatch(fetchFail());
      dispatch(showErrors(data.message, 'error'));
    }
  } catch (error) {
    if (loading) dispatch(fetchFail());
    dispatch(showErrors(error.message, 'error'));
  }
};

export const getShowtime = (showtimeId) => async (dispatch) => {
  dispatch(fetchRequest());
  try {
    const url = `/api/showtimes/${showtimeId}`;
    const response = await fetch(url, {
      method: 'GET',
    });
    const data = await response.json();
    if (!data.error) {
      dispatch(setShowtime(data));
    }
    if (data.error) {
      dispatch(fetchFail());
      dispatch(showErrors(data.message, 'error'));
    }
  } catch (error) {
    dispatch(fetchFail());
    dispatch(showErrors(error.message, 'error'));
  }
};

export const clearShowtime = () => async (dispatch) => {
  dispatch(removeShowtime());
};

export const clearShowtimes = () => async (dispatch) => {
  dispatch(removeShowtimes());
};
