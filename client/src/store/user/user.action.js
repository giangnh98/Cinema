export const REGISTER_SUCCESS = "@@User/RegisterSuccess";
export const REGISTER_FAIL = "@@User/RegisterFail";
export const USER_LOADED = "@@User/UserLoaded";
export const AUTH_ERROR = "@@User/AuthError";
export const LOGIN_SUCCESS = "@@User/LoginSuccess";
export const LOGIN_FAIL = "@@User/LoginFail";
export const LOGOUT = "@@User/Logout";
export const FETCH_REQUEST = "@@User/FetchRequest";
export const UPDATE_SUCCESS = "@@User/UpdateSuccess";
export const UPDATE_ACCOUNT = "@@User/UpdateAccount";
export const UPDATE_FAIL = "@@User/UpdateFail";
export const FETCH_FAIL = "@@User/FetchFail";
export const GET_USER = "@@User/GetPages";
export const GET_USERS = "@@User/GetUsers";
export const DELETE_USER = "@@User/DeleteUser";

export const actions = {
   fetchFail: () => {
      return { type: FETCH_FAIL };
   },
   setUsers: (users) => {
      return { type: GET_USERS, payload: users };
   },
   deleteUser: () => {
      return { type: DELETE_USER };
   },
   setUserRef: (user) => {
      return { type: GET_USER, payload: user };
   },
   registerSuccess: () => {
      return { type: REGISTER_SUCCESS };
   },
   registerFail: () => {
      return { type: REGISTER_FAIL };
   },
   userLoaded: (data) => {
      return { type: USER_LOADED, payload: data };
   },
   authError: () => {
      return { type: AUTH_ERROR };
   },
   loginSuccess: (data) => {
      return { type: LOGIN_SUCCESS, payload: data };
   },
   loginFail: () => {
      return { type: LOGIN_FAIL };
   },
   endSession: () => {
      return { type: LOGOUT };
   },
   fetchRequest: () => {
      return { type: FETCH_REQUEST };
   },
   updateSuccess: (data) => {
      return { type: UPDATE_SUCCESS, payload: data };
   },
   updateAccount: () => {
      return { type: UPDATE_ACCOUNT };
   },
   updateFail: () => {
      return { type: UPDATE_FAIL };
   }
};