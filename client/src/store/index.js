import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import usersReducer from "./user/user.reducer";
import moviesReducer from "./movie/movie.reducer";
import alertsReducer from "./alert/alert.reducer";
import cinemasReducer from "./cinema/cinema.reducer";
import showtimesReducer from "./showtime/showtime.reducer";
import roomsReducer from "./room/room.reducer";

const initialState = {};
const middleware = [
   thunk
];

const rootReducer = combineReducers({
   alertState: alertsReducer,
   userState: usersReducer,
   movieState: moviesReducer,
   cinemaState: cinemasReducer,
   showtimeState: showtimesReducer,
   roomState: roomsReducer
});

// noinspection JSCheckFunctionSignatures
const store = createStore(
   rootReducer,
   initialState,
   composeWithDevTools(applyMiddleware(...middleware))
);

export default store;