import * as UserActions from "./user.action";

const initialState = {
   token: localStorage.getItem("token"),
   isAuthenticated: false,
   loading: false,
   user: localStorage.getItem("user"),
   users: [],
   error: null
};

export default function usersReducer(state = initialState, action) {
   switch (action.type) {
      case UserActions.GET_USERS:
         return {
            ...state,
            users: action.payload,
            loading: false
         };
      case UserActions.GET_USER:
         return {
            ...state,
            loading: false,
            user: action.payload
         };
      case UserActions.FETCH_REQUEST: {
         return {
            ...state,
            loading: true
         };
      }
      case UserActions.USER_LOADED:
         return {
            ...state,
            loading: false,
            isAuthenticated: true,
            user: action.payload
         };
      case UserActions.DELETE_USER:
      case UserActions.UPDATE_ACCOUNT:
      case UserActions.UPDATE_FAIL:
      case UserActions.REGISTER_SUCCESS:
         return {
            ...state,
            loading: false
         };
      case UserActions.LOGIN_SUCCESS:
      case UserActions.UPDATE_SUCCESS:
         localStorage.setItem("token", action.payload.token);
         return {
            ...state,
            ...action.payload,
            isAuthenticated: true,
            loading: false
         };
      case UserActions.REGISTER_FAIL:
      case UserActions.LOGIN_FAIL:
      case UserActions.AUTH_ERROR:
         localStorage.removeItem("token");
         return {
            ...state,
            token: null,
            isAuthenticated: null,
            loading: false,
            user: null
         };
      case UserActions.LOGOUT:
         localStorage.removeItem("token");
         return {
            ...state,
            token: null,
            isAuthenticated: null,
            loading: false,
            user: null
         };
      default:
         return state;
   }
}